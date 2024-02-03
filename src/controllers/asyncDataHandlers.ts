import { Backend } from './Backend';
import { PluginManager } from './PluginManager';
import { Log } from '../lib/log';
import { DSPParamSettings } from '../types/dspTypes';
import { PluginData, PluginSettings } from '../types/types';
import { profileManager } from './ProfileManager';
import { Dispatch, SetStateAction } from 'react';
import { DataProviderSetData } from '../contexts/contexts';
import { PromiseStatus, useError } from '../lib/utils';

export async function handleWaitSettings(setData: DataProviderSetData<PluginData>, setReady: Dispatch<SetStateAction<boolean>>) {
    profileManager.assignSetters(setData, setReady);
    const promises: [Promise<PluginSettings | Error>, Promise<DSPParamSettings | Error>] = [handleGetPluginSettingsOnMount(), handleGetDspSettingsOnMount()];

    Promise.allSettled(promises).then((results) => {
        Log.log('resuts', results)
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
    })

}

async function handleGetPluginSettingsOnMount() {
    const profileManloaded = await PluginManager.state.profileManagerLoaded!;
    if (profileManloaded instanceof Error) {
        // Log.warn('Trying to use dsp settings but James DSP failed when trying to start');
        return profileManloaded;
    }

    try {
        const settings = await Backend.getSettings();
        return settings;
    } catch (err) {
        return useError(`Problem getting plugin settings - \n ${(err as Error).message ?? ''}`);
    }
}

async function handleGetDspSettingsOnMount() {
    const loaded = await PluginManager.state.jdspLoaded!;
    if (loaded instanceof Error) {
        Log.warn('Trying to use dsp settings but James DSP failed when trying to start');
        return loaded;
    }

    return await handleGetDspSettingsAfterProfileLoad();
}

export async function handleGetDspSettingsAfterProfileLoad() {
    const profileLoadRes = profileManager.lock?.status === PromiseStatus.pending ? await profileManager.lock.promise : null;
    // const profileLoadRes = profileManager.lock ? await profileManager.lock.promise : null;
    Log.log('auto handle done waiting')
    // if (profileLoadRes instanceof Error) {
    //     const error = new Error(`Problem trying to load profile - \n ${profileLoadRes.message}`)
    //     Log.error(error);
    //     return profileLoadRes;
    // }
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