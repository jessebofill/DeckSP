import { ServerAPI } from 'decky-frontend-lib';
import { Backend } from './Backend';
import { Log } from '../lib/log';

export class PluginManager {
    static state: { jdspLoaded?: Promise<boolean | Error> } = { }

    static start(serverApi: ServerAPI) {
        Backend.init(serverApi);

        Log.log('Trying to start James DSP')
        this.state.jdspLoaded = Backend.startJDSP().then(res => {
            Log.log('James DSP was started');
            return res;
        }).catch((err: Error) => {
            const msg = `James DSP couldn't be started - \n ${err.message}`;
            const error = new Error(msg);
            Log.error(error);
            return error;
        });
    }
}