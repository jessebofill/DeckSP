import { SFXPath, GamepadUIAudio } from './GamepadUIAudio';
import { PresetSectionType, PresetTable } from '../types/dspTypes';
import { Log } from './log';
import { findModuleChild, Module } from '@decky/ui';
import { dspParamDefines } from '../defines/dspParameterDefines';
import { toaster } from '@decky/api';
import { ReactNode } from 'react';

export function playUISound(path: SFXPath) {
    //@ts-ignore
    if (settingsStore?.m_ClientSettings?.enable_ui_sounds) GamepadUIAudio.AudioPlaybackManager.PlayAudioURL(path);
}

export function addClasses(...strings: any[]) {
    return strings.filter(string => string).join(' ');
}

export function reverseLookupSectionPreset<PresetType extends PresetSectionType>(presetTable: PresetTable<PresetType>, compareObject: { [key: string]: any }) {
    return Object.keys(presetTable.presets).find(preset => (presetTable.presets[preset] as number[]).every((value, index) => {
        const parameter = presetTable.paramMap[index];
        return value === (typeof compareObject[parameter] === 'number' ? parseFloat(compareObject[parameter].toFixed(dspParamDefines[parameter]?.step === 0.01 ? 2 : 1)) : compareObject[parameter]);
    }));
}

export function getThrottled(func: Function, wait: number) {
    Log.log('getting throttled')
    let timeout: NodeJS.Timeout | null;
    return function (this: any, ..._: any[]) {
        Log.log('calling throt')
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout as NodeJS.Timeout);
        timeout = setTimeout(later, wait);
    };
}

export function getActiveAppId() {
    // return SystemPerfStore.msgState.current_game_id;
    return (SteamUIStore.MainRunningAppID ?? 769).toString();
}

export function getAppName(appId: string) {
    return appStore.GetAppOverviewByAppID(parseInt(appId))?.display_name ?? appId;
}

export enum PromiseStatus {
    Pending,
    Fulfilled,
    Rejected
}
export function MakeQueryablePromise(promise: Promise<any>) {
    let state = PromiseStatus.Pending;

    let result = promise.then(res => {
        state = PromiseStatus.Fulfilled;
        return res;
    },
        e => {
            state = PromiseStatus.Rejected;
            throw e;
        }
    );

    return { promise: result, get status() { return state; } };
}

export function initSystemPerfStore() {
    window.SystemPerfStore || findModuleChild((m: Module) => {
        if (typeof m !== "object") return undefined;
        for (let prop in m) {
            if (m[prop]?.prototype?.SetPerfOverlayLevel) return m[prop];
        }
    })?.Get();
}

export function useError(message: string) {
    const error = new Error(message);
    Log.error(error);
    return error;
}

export function toast(title: ReactNode, message: string, durationMs: number = 4000, icon?: ReactNode) {
    toaster.toast({
        title,
        body: message,
        duration: durationMs,
        icon
    });
}
