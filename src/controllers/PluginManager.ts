import { Backend } from './Backend';
import { Log } from '../lib/log';
import { profileManager } from './ProfileManager';
import { initSystemPerfStore, useError } from '../lib/utils';
import { DSPParamSettings } from '../types/dspTypes';

export class PluginManager {
    static state: {
        jdspLoaded?: Promise<boolean | Error>
        profileManagerLoaded?: Promise<DSPParamSettings | Error>
    } = {}

    static async start() {
        initSystemPerfStore();

        Log.log('Trying to start James DSP...')
        this.state.jdspLoaded = Backend.startJDSP().then(res => {
            if (res) Log.log('James DSP was started');
            else useError(`James DSP couldn't be started because a problem was detected with it's installation`);

            return res;
        }).catch(e => useError('Encountered an error when trying to start James DSP', e));

        await this.state.jdspLoaded;

        const profileManagerInit = profileManager.init();
        profileManager.setLock(profileManagerInit);
        this.state.profileManagerLoaded = profileManagerInit.then((res) => res instanceof Error ? useError('Problem during ProfileManager init process', res) : res);
    }
}

