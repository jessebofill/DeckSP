import { Backend } from './Backend';
import { Log } from '../lib/log';
import { profileManager } from './ProfileManager';
import { initSystemPerfStore, useError } from '../lib/utils';
import { DSPParamSettings } from '../types/dspTypes';
import { PluginSettings } from '../types/types';
import { sleep } from '@decky/ui';

type PromiseKey = keyof typeof PluginManager.promises;

export class PluginManager {
    static promises: {
        jdspLoaded?: Promise<boolean | Error>
        profileManagerLoaded?: Promise<DSPParamSettings | Error>
        pluginSettings?: Promise<PluginSettings | Error>
        waitForEELScriptChange?: Promise<undefined | Error>
    } = {};
    private static uiMode?: EUIMode

    static async init() {
        initSystemPerfStore();
        this.promises.pluginSettings = Backend.getPluginSettings().catch((e) => useError('Problem getting plugin settings', e));

        SteamClient.UI.RegisterForUIModeChanged(async uiMode => {
            if (this.uiMode === uiMode) return;
            else this.uiMode = uiMode;

            const settings = await this.promises.pluginSettings!;
            if (uiMode === EUIMode.Desktop) {
                if (!(settings instanceof Error) && settings.enableInDesktop) this.start();
                else this.killJDSP();
            } else {
                this.start();
            }
        });
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

        const profileManagerInit = profileManager.init();
        profileManager.setLock(profileManagerInit);
        this.promises.profileManagerLoaded = profileManagerInit.then((res) => res instanceof Error ? useError('Problem during ProfileManager init process', res) : res);
    }

    private static async isJDSPReady() {
        return (await this.promises.jdspLoaded) === true;
    }

    private static async isStatePromiseStatusOk(promise: keyof typeof PluginManager.promises) {
        const res = (await (this.promises[promise] ?? new Error()));
        return !(res instanceof Error);
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
}

