import { Backend } from './Backend';
import { PluginManager } from './PluginManager';
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

async function handleGetPluginStateOnMount(): Promise<PluginStateData | Error> {
    await PluginManager.waitForPromiseCreation('pluginSettings');
    const settings = await PluginManager.promises.pluginSettings!
    if (settings instanceof Error) return settings;
    
    await PluginManager.waitForPromiseCreation('jdspLoaded');
    const jdspInstall = await PluginManager.promises.jdspLoaded!;
    if (jdspInstall instanceof Error) return jdspInstall;
    
    if (jdspInstall) {
        await PluginManager.waitForPromiseCreation('profileManagerLoaded');
        const profileManloaded = await PluginManager.promises.profileManagerLoaded;
        if (profileManloaded instanceof Error) return profileManloaded;
    }

    return { jdspInstall, settings, isDesktopMode: PluginManager.isDesktopUI() };
}

async function handleGetDspSettingsOnMount() {
    await PluginManager.waitForPromiseCreation('jdspLoaded');
    const loaded = await PluginManager.promises.jdspLoaded!;
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
        return await Backend.getDspAll();
    } catch (e) {
        return useError('Problem getting dsp settings', e);
    }
}