import { SFXPath, GamepadUIAudio } from './GamepadUIAudio';
import { DSPParameter, DSPParameterCompResponse, DSPParameterEQParameters, DSPParameterType, PresetSectionType, PresetTable } from '../types/dspTypes';
import { Log } from './log';
import { findModuleExport, getFocusNavController, Navigation } from '@decky/ui';
import { dspParamDefines, dspScaledParams } from '../defines/dspParameterDefines';
import { toaster } from '@decky/api';
import { ReactNode } from 'react';
import { stringifyNestedParams } from './parseDspParams';
import { ParamSendValueType } from '../controllers/Backend';

export function playUISound(path: SFXPath) {
    //@ts-ignore
    if (settingsStore?.m_ClientSettings?.enable_ui_sounds) GamepadUIAudio.AudioPlaybackManager.PlayAudioURL(path);
}

export function addClasses(...strings: any[]) {
    return strings.filter(string => string).join(' ');
}

export function reverseLookupSectionPreset<PresetType extends PresetSectionType>(presetTable: PresetTable<PresetType>, compareObject: { [key: string]: any }) {
    return Object.keys(presetTable.presets).find(preset => (presetTable.presets[preset as keyof typeof presetTable.presets]).every((value, index) => {
        const parameter = presetTable.paramMap[index];
        //@ts-ignore
        return value === (typeof compareObject[parameter] === 'number' ? parseFloat(compareObject[parameter].toFixed(dspParamDefines[parameter]?.step === 0.01 ? 2 : 1)) : compareObject[parameter]);
    }));
}

export function isDSPScaledParameter(parameter: string): parameter is keyof typeof dspScaledParams {
    return parameter in dspScaledParams;
}

export function formatDspValue<Param extends DSPParameter>(parameter: Param, value: DSPParameterType<Param>) {
    return (parameter === 'compander_response' || parameter === 'tone_eq' ?
        stringifyNestedParams(value as DSPParameterType<DSPParameterCompResponse | DSPParameterEQParameters>) :
        isDSPScaledParameter(parameter) ?
            (value as number) / dspScaledParams[parameter] :
            value) as ParamSendValueType<Param>;
}

export function getDebounced(func: Function, wait: number) {
    let timeout: NodeJS.Timeout | null;
    return function (this: any, ..._: any[]) {
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
    window.SystemPerfStore || findModuleExport(e => e.prototype?.SetPerfOverlayLevel)?.Get();
}

export function useError(message: string, exception?: any) {
    let append: String | undefined;
    if (exception instanceof String) append = exception;
    else if (exception?.message !== undefined) {
        append = exception.message;
        if (exception.pythonTraceback) append = `${append}\n${exception.pythonTraceback}`;
    }

    if (append) message = `${message} -\n${append}`;
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

export function navigateUrl(url: string) {
    window.WebBrowserPlugin?.openInBrowser ? window.WebBrowserPlugin.openInBrowser(url) : Navigation.NavigateToExternalWeb(url);
}

export function getFocusNav() {
    return getFocusNavController() as FocusNavController | undefined;
}