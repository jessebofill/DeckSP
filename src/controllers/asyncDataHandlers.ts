import { Backend } from './Backend';
import { PluginManager } from './PluginManager';
import { Log } from '../lib/log';
import { DSPParamSettings } from '../types/dspTypes';
import { PluginData, PluginStateData } from '../types/types';
import { profileManager } from './ProfileManager';
import { Dispatch, SetStateAction } from 'react';
import { DataProviderSetData } from '../contexts/contexts';
import { PromiseStatus, useError } from '../lib/utils';

export async function handleWaitSettings(setData: DataProviderSetData<PluginData>, setReady: Dispatch<SetStateAction<boolean>>) {
    profileManager.assignSetters(setData, setReady);
    const promises: [Promise<PluginStateData | Error>, Promise<DSPParamSettings | Error>] = [handleGetPluginStateOnMount(), handleGetDspSettingsOnMount()];

    Promise.allSettled(promises).then((results) => {
        Log.log('results', results)
        const errors: { plugin?: Error, dsp?: Error } = {};
        const data: PluginData = {
            errors: errors
        };
        if (results[0].status === 'fulfilled') {
            if (results[0].value instanceof Error) errors.plugin = results[0].value;
            else data.plugin = results[0].value;
        }
        if (results[1].status === 'fulfilled') {
            if (results[1].value instanceof Error) errors.dsp = results[1].value;
            else data.dsp = results[1].value;
        }

        setData(data);
        setReady(true);
    });
}

async function handleGetPluginStateOnMount() {
    const loaded = await PluginManager.state.jdspLoaded!;
    if (loaded instanceof Error) return loaded;

    if (loaded) {
        const profileManloaded = await PluginManager.state.profileManagerLoaded!;
        if (profileManloaded instanceof Error) return profileManloaded;
    }
    
    return { jdspInstall: loaded };
}

async function handleGetDspSettingsOnMount() {
    const loaded = await PluginManager.state.jdspLoaded!;
    if (loaded instanceof Error) return loaded;

    return await handleGetDspSettingsAfterProfileLoad();
}

export async function handleGetDspSettingsAfterProfileLoad() {
    const profileLoadRes = profileManager.lock?.status === PromiseStatus.Pending ? await profileManager.lock.promise : null;
    if (profileLoadRes) return profileLoadRes;

    return await handleGetDspSettings();
}

export async function handleGetDspSettings() {
    try {
        const settings = await Backend.getDspAll();
        Log.log('Got dsp settings', settings);
        return settings;
    } catch (err) {
        return useError(`Problem getting dsp settings - \n ${(err as Error).message ?? ''}`);
    }
}