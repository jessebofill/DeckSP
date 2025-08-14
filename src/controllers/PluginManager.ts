import { Backend } from './Backend';
import { Log } from '../lib/log';
import { profileManager } from './ProfileManager';
import { initSystemPerfStore, toast, useError } from '../lib/utils';
import { DSPParamSettings } from '../types/dspTypes';
import { PluginSettings, Static } from '../types/types';
import { EUIMode, sleep, Unregisterable } from '@decky/ui';
import { ELoginState } from '@decky/ui/dist/globals/steam-client/User';
import { PLUGIN_NAME } from '../defines/constants';
import { makeObservable, observable } from 'mobx';

type PromiseKey = keyof typeof PluginManager.promises;
type User = {
    name: string;
    id: string;
    persona: string;
};

export class PluginManager {
    static promises: {
        jdspLoaded?: Promise<boolean | Error>
        profileManagerLoaded?: Promise<DSPParamSettings | Error>
        pluginSettings?: Promise<PluginSettings | Error>
        static?: Promise<Static | Error>
    } = {};
    private static uiMode?: EUIMode
    private static isDisplayExternal?: boolean
    static messages: string[] = [];
    static currentUser?: User;
    static {
        makeObservable(PluginManager, { messages: observable });
    }

    static init() {
        let disposed = false;
        const listeners: Unregisterable[] = [];
        const dispose = () => {
            if (!disposed) {
                this.killJDSP();
                listeners.forEach(listener => listener.unregister());
                disposed = true;
            }
        };

        initSystemPerfStore();
        listeners.push(SteamClient.User.RegisterForLoginStateChange((_, loginState) => {
            if (loginState === ELoginState.Success) {
                const { strAccountName: name, strSteamID: id } = App.GetCurrentUser();
                const persona = App.cm.persona_name;
                this.currentUser = { name, id, persona };
            }
        }));

        listeners.push(SteamClient.UI.RegisterForUIModeChanged(async uiMode => {
            if (this.uiMode === uiMode) return;
            else this.uiMode = uiMode;
            while (!this.currentUser) {
                await sleep(2000);
            }

            this.promises.pluginSettings = Backend.initUser(this.currentUser.id, this.currentUser.name, this.currentUser.persona).catch((e) => useError('Problem initializing user', e));
            const settings = await this.promises.pluginSettings;
            if (uiMode === EUIMode.Desktop) {
                if (!(settings instanceof Error) && settings.enableInDesktop) this.start();
                else this.killJDSP();
            } else {
                this.start();
            }
        }));

        listeners.push(SteamClient.Settings.RegisterForSettingsChanges(settings => {
            if (!this.isDisplayExternal && settings.bDisplayIsExternal) {
                (async () => {
                    toast(`${PLUGIN_NAME}: Detected external display`, 'Please wait while attempting required relink of audio pipeline', 8000)
                    try {
                        await Backend.relinkPW()
                        toast(`${PLUGIN_NAME}: Finished audio pipeline relink`, 'External display audio should now work');
                    } catch (e: any) {
                        const title = 'Audio pipeline relink failed';
                        const errMsg = ('message' in e) ? e.message : ''
                        toast(`${PLUGIN_NAME}: ${title}`, errMsg);
                        this.addMessage(`${title}; if audio is not working restart Steam${errMsg ? `\n${errMsg}` : ''}`)
                    }
                })();
            }
            this.isDisplayExternal = settings.bDisplayIsExternal
        }))

        listeners.push(SteamClient.User.RegisterForShutdownStart(() => dispose()));
        return dispose;
    }

    private static async start() {
        profileManager.active = true;
        if (!await this.isJDSPReady()) {
            Log.log('Starting James DSP...')
            this.promises.jdspLoaded = Backend.startJDSP()
                .then(res => {
                    if (!res) useError(`James DSP couldn't be started because a problem was detected with it's installation`);
                    return res;
                })
                .catch(e => useError('Encountered an error when trying to start James DSP', e));
        }

        if (!await this.isJDSPReady() || await this.isStatePromiseStatusOk('profileManagerLoaded')) return;

        const profileManagerInit = profileManager.init(this, this.currentUser!.id);
        profileManager.setLock(profileManagerInit);
        this.promises.profileManagerLoaded = profileManagerInit.then((res) => res instanceof Error ? useError('Problem during ProfileManager init process', res) : res);
        this.promises.static = Backend.getStaticData().catch(e => useError('Error loading static data', e));
        this.assignProfileManagerUserNames();
    }

    private static async isJDSPReady() {
        return (await this.promises.jdspLoaded) === true;
    }

    private static async isStatePromiseStatusOk(promise: keyof typeof PluginManager.promises) {
        const res = (await (this.promises[promise] ?? new Error()));
        return !(res instanceof Error);
    }

    private static async assignProfileManagerUserNames() {
        await this.waitForPromiseCreation('static');
        const data = await this.promises.static!;
        if (data instanceof Error) return;
        const { userMap } = data;
        Object.entries(userMap).forEach(([userId, [accountName, persona]]) => {
            if (profileManager.otherUsers[userId]) {
                profileManager.otherUsers[userId].name = accountName;
                profileManager.otherUsers[userId].persona = persona;
            }
        });
    }

    static updateSettings(newSettings: Partial<PluginSettings>, waitForErrorCheck?: boolean) {
        const setPromise = Backend.setPluginSettings(newSettings).catch(e => useError(`Problem setting settings with data: ${JSON.stringify(newSettings)}`, e));
        const prev = this.promises.pluginSettings;
        this.promises.pluginSettings = (async () => {
            const prevSettings = await prev!;
            if (waitForErrorCheck) {
                const setRes = await setPromise
                if (setRes instanceof Error) return setRes;
            }
            if (prevSettings instanceof Error) return prevSettings;
            return { ...prevSettings, ...newSettings };
        })();
        return this.promises.pluginSettings;
    }

    static async killJDSP() {
        profileManager.active = false;
        Log.log('Killing JamesDSP')
        this.promises.jdspLoaded = (async () => {
            await Backend.killJDSP().catch((e) => useError('Problem trying to kill JamesDSP', e));
            return false;
        })();
    }

    static arePromisesCreated(...promises: PromiseKey[]) {
        const proms: PromiseKey[] = promises.length === 0 ? Object.keys(PluginManager.promises) as PromiseKey[] : promises;
        return proms.every(promiseKey => this.promises[promiseKey] instanceof Promise);
    }

    static async waitForPromiseCreation(...promises: PromiseKey[]) {
        while (!PluginManager.arePromisesCreated(...promises)) {
            await sleep(100);
        }
    }

    static isDesktopUI() {
        return this.uiMode === EUIMode.Desktop;
    }

    static addMessage(msg: string) {
        this.messages.push(msg);
    }
}

