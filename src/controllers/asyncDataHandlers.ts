import { Backend } from './Backend';
import { PluginManager } from './PluginManager';
import { AsyncDataProviderSetData, AsyncDataProviderSetError } from '../components/generic/AsyncDataProvider';
import { Log } from '../lib/log';
import { DSPParamSettings } from '../types/dspTypes';

export async function handleDspSettings(setData: AsyncDataProviderSetData<DSPParamSettings>, setError: AsyncDataProviderSetError) {
    const loaded = await PluginManager.state.jdspLoaded;
    if (loaded instanceof Error) {
        Log.warn('Trying to use dsp settings but James DSP failed when trying to start')
        setError(loaded);
        return;
    }

    Backend.getDspAll().then(settings => {
        setData(settings);
        Log.log('Got dsp settings', settings);

    }).catch((err: Error) => {
        const error = new Error(`Problem getting dsp settings - \n ${err.message}`)
        Log.error(error);
        setError(error);
    })
}