import { call } from '@decky/api';
import { parseJDSPAll } from '../lib/parseDspParams';
import { DSPParameter, DSPParameterCompResponse, DSPParameterEQParameters, DSPParameterType } from '../types/dspTypes';
import { formatDspValue } from '../lib/utils';
import { OtherPluginSettings } from '../types/types';

export type BackendMethod = PluginMethod | JDSPMethod;

export type PluginGetSettingsMethod = 'get_settings';
export type PluginSetSettingMethod = 'set_setting';
export type PluginStartJDSPMethod = 'start_jdsp';
export type PluginKillJDSPMethod = 'kill_jdsp';
export type PluginSetAppWatchMethod = 'set_app_watch';
export type PluginInitProfilesMethod = 'init_profiles';
export type PluginSetManuallyApplyProfilesMethod = 'set_manually_apply_profiles';
export type PluginFlatpakRepairMethod = 'flatpak_repair';


export type PluginMethod =
    PluginGetSettingsMethod |
    PluginSetSettingMethod |
    PluginStartJDSPMethod |
    PluginKillJDSPMethod |
    PluginSetAppWatchMethod |
    PluginInitProfilesMethod |
    PluginSetManuallyApplyProfilesMethod |
    PluginFlatpakRepairMethod;

export type PluginMethodArgs<Method extends PluginMethod, Setting extends keyof OtherPluginSettings = never> =
    Method extends PluginGetSettingsMethod | PluginStartJDSPMethod | PluginKillJDSPMethod | PluginFlatpakRepairMethod ? [] :
    Method extends PluginSetSettingMethod ? [setting: Setting, value: OtherPluginSettings[Setting]] :
    Method extends PluginSetAppWatchMethod ? [appId: string, watch: boolean] :
    Method extends PluginInitProfilesMethod ? [globalPreset: string] :
    Method extends PluginSetManuallyApplyProfilesMethod ? [useManual: boolean] :
    never;

export type PluginMethodResponse<Method extends PluginMethod> =
    Method extends PluginGetSettingsMethod ? OtherPluginSettings :
    Method extends PluginStartJDSPMethod ? boolean :
    Method extends PluginKillJDSPMethod | PluginSetSettingMethod | PluginSetAppWatchMethod | PluginSetManuallyApplyProfilesMethod | PluginFlatpakRepairMethod ? undefined :
    Method extends PluginInitProfilesMethod ? { manualPreset: string, allPresets: string, watchedGames: { [appId: string]: boolean }, manuallyApply: boolean } :
    never;

interface PluginMethodError {
    error: string;
}

export type JDSPSetMethod = 'set_jdsp_param';
export type JDSPSetMultipleMethod = 'set_jdsp_params';
export type JDSPGetAllMethod = 'get_all_jdsp_param';
export type JDSPSetDefaultsMethod = 'set_jdsp_defaults';
export type JDSPCreateDefaultPresetMethod = 'create_default_jdsp_preset';
export type JDSPNewPresetMethod = 'new_jdsp_preset';
export type JDSPDeletePresetMethod = 'delete_jdsp_preset';
export type JDSPSetProfileMethod = 'set_profile';

export type JDSPMethod =
    JDSPSetMethod |
    JDSPSetMultipleMethod |
    JDSPGetAllMethod |
    JDSPSetDefaultsMethod |
    JDSPCreateDefaultPresetMethod |
    JDSPNewPresetMethod |
    JDSPDeletePresetMethod |
    JDSPSetProfileMethod;

export type ParamSendValueType<Param extends DSPParameter> =
    Param extends DSPParameterCompResponse | DSPParameterEQParameters ?
    string :
    DSPParameterType<Param>;

export type JDSPMethodArgs<Method extends JDSPMethod, Param extends DSPParameter = never> =
    Method extends JDSPSetMethod ? [parameter: Param, value: ParamSendValueType<Param>] :
    Method extends JDSPSetMultipleMethod ? [[DSPParameter, ParamSendValueType<DSPParameter>][]] :
    Method extends JDSPGetAllMethod ? [] :
    Method extends JDSPCreateDefaultPresetMethod | JDSPSetDefaultsMethod ? [defaultPreset: string] :
    Method extends JDSPNewPresetMethod ? [presetName: string, fromPresetName?: string] :
    Method extends JDSPDeletePresetMethod ? [presetName: string] :
    Method extends JDSPSetProfileMethod ? [presetName: string, isManual: boolean] :
    never;

export interface JDSPResponse {
    jdsp_result?: string;
    jdsp_error?: string;
}

export class Backend {
    private static async callPlugin<Method extends PluginMethod, Setting extends keyof OtherPluginSettings>(method: Method, ...args: PluginMethodArgs<Method, Setting>) {
        const response = await call<PluginMethodArgs<Method, Setting>, PluginMethodResponse<Method> | PluginMethodError>(method, ...args);
        if ((response as PluginMethodError)?.error !== undefined) throw new Error(`Backend error: ${(response as PluginMethodError).error}`);
        return response as PluginMethodResponse<Method>;
    }

    private static async callJDSP<Method extends JDSPMethod, Param extends DSPParameter>(method: Method, ...args: JDSPMethodArgs<Method, Param>) {
        const response = await call<JDSPMethodArgs<Method, Param>, JDSPResponse>(method, ...args);
        if (response.jdsp_error !== undefined) throw new Error(`JDSP error: ${response.jdsp_error}`);
        else return response.jdsp_result!;
    }

    //jdsp specific calls
    static async setDsp<Param extends DSPParameter>(parameter: Param, value: DSPParameterType<Param>) {
        return await this.callJDSP('set_jdsp_param', parameter, formatDspValue(parameter, value));
    }
    static async setMultipleDsp<Params extends DSPParameter[]>(...parameters: { [K in keyof Params]: [Params[K], DSPParameterType<Params[K]>] }) {
        const params = parameters.map(([param, value]) => [param, formatDspValue(param, value)] as [DSPParameter, ParamSendValueType<DSPParameter>]);
        return await this.callJDSP('set_jdsp_params', params);
    }
    static async getDspAll() {
        return parseJDSPAll(await this.callJDSP('get_all_jdsp_param'));
    }
    static async setDspDefaults(defaultPreset: string) {
        return parseJDSPAll(await this.callJDSP('set_jdsp_defaults', defaultPreset));
    }
    static async createDefaultPreset(defaultName: string) {
        return await this.callJDSP('create_default_jdsp_preset', defaultName);
    }
    static async newPreset(presetName: string, fromPresetName?: string) {
        return await this.callJDSP('new_jdsp_preset', presetName, fromPresetName);
    }
    static async deletePreset(presetName: string) {
        return await this.callJDSP('delete_jdsp_preset', presetName);
    }
    static async setProfile(presetName: string, isManual: boolean) {
        return parseJDSPAll(await this.callJDSP('set_profile', presetName, isManual));
    }


    //general plugin calls
    static async startJDSP() {
        return await this.callPlugin('start_jdsp');
    }
    static async killJDSP() {
        return await this.callPlugin('kill_jdsp');
    }
    static async getPluginSettings() {
        return await this.callPlugin('get_settings');
    }
    static async setPluginSetting<Setting extends keyof OtherPluginSettings>(setting: Setting, value: OtherPluginSettings[Setting]) {
        return await this.callPlugin('set_setting', setting, value);
    }
    static async flatpakRepair() {
        return await this.callPlugin('flatpak_repair');
    }
    static async setAppWatch(appId: string, watch: boolean) {
        return await this.callPlugin('set_app_watch', appId, watch);
    }
    static async initProfiles(globalPreset: string) {
        return await this.callPlugin('init_profiles', globalPreset);
    }
    static async setManuallyApplyProfiles(useManual: boolean) {
        return await this.callPlugin('set_manually_apply_profiles', useManual);
    }
}