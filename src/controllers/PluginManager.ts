import { Backend } from './Backend';
import { Log } from '../lib/log';
import { profileManager } from './ProfileManager';
import { initSystemPerfStore, useError } from '../lib/utils';
import { DSPParamSettings } from '../types/dspTypes';
import { EUIMode } from '../types/types';
import { sleep } from '@decky/ui';

type PromiseKey = keyof typeof PluginManager.promises;

interface DesktopModeData { enable: boolean, isCurrentUI: boolean }
export class PluginManager {
    static promises: {
        jdspLoaded?: Promise<boolean | Error>
        profileManagerLoaded?: Promise<DSPParamSettings | Error>
        desktopMode?: Promise<DesktopModeData | Error>
    } = {};
    private static uiMode?: EUIMode

    static async init() {
        initSystemPerfStore();
        this.promises.desktopMode = Backend.getPluginSettings().then(settings => ({ isCurrentUI: false, enable: settings.enableInDesktop })).catch((e) => useError('Problem getting plugin settings', e));

        SteamClient.UI.RegisterForUIModeChanged(async uiMode => {
            if (this.uiMode === uiMode) return; 
            else this.uiMode = uiMode;
            const isDesktopMode = uiMode === EUIMode.Desktop;
            this.queueNewDesktopData({ isCurrentUI: isDesktopMode });

            const desktop = await this.promises.desktopMode!
            if (desktop instanceof Error) return
            if (isDesktopMode) {
                if (desktop.enable) this.start();
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
                .then(res => res ? res : useError(`James DSP couldn't be started because a problem was detected with it's installation`))
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

    private static queueNewDesktopData(newDesktopData: Partial<DesktopModeData>, waitForErrorCheck?: Promise<any>) {
        const prev = this.promises.desktopMode
        this.promises.desktopMode = (async () => {
            const res = await prev!
            if (waitForErrorCheck) {
                const res2 = await waitForErrorCheck
                if (res2 instanceof Error) return res2;
            }
            if (res instanceof Error) return res;
            return { ...res, ...newDesktopData };
        })();
    }

    static async setEnableInDestop(enable: boolean) {
        this.queueNewDesktopData({ enable }, Backend.setPluginSetting('enableInDesktop', enable).catch(e => useError('Problem setting enable in desktop mode', e)));
        return await this.promises.desktopMode!;
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
        const proms: PromiseKey[]  = promises.length === 0 ? ['desktopMode', 'jdspLoaded', 'profileManagerLoaded'] : promises;
        return proms.every(promiseKey => this.promises[promiseKey] instanceof Promise);
    }

    static async waitForPromiseCreation(...promises: PromiseKey[]) {
        while (!PluginManager.arePromisesCreated(...promises)){
            await sleep(100);
        }
    }
}

