import { ServerAPI } from 'decky-frontend-lib';
import { Backend } from './Backend';
import { Log } from '../lib/log';
import { profileManager } from './ProfileManager';
import { initSystemPerfStore, useError } from '../lib/utils';
import { DSPParamSettings } from '../types/dspTypes';
import { Toaster } from './Toaster';

export class PluginManager {
    static state: {
        jdspLoaded?: Promise<boolean | Error>
        profileManagerLoaded?: Promise<DSPParamSettings | Error>
    } = {}

    static start(serverApi: ServerAPI) {
        initSystemPerfStore();
        Toaster.init(serverApi);
        Backend.init(serverApi);

        const profileManagerInit = profileManager.init();
        profileManager.setLock(profileManagerInit);
        this.state.profileManagerLoaded = profileManagerInit.then((res) => res instanceof Error ? useError(`Problem during ProfileManager init process - \n ${res.message}`) : res);

        Log.log('Trying to start James DSP')
        this.state.jdspLoaded = Backend.startJDSP().then(() => {
            Log.log('James DSP was started');
            return true;
        }).catch((err: Error) => useError(`Encountered an error when trying to start James DSP - \n ${err.message}`));
    }
}

