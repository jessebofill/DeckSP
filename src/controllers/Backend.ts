import { call } from '@decky/api';
import { parseJDSPAll } from '../lib/parseDspParams';
import { DSPParameter, DSPParameterCompResponse, DSPParameterEQParameters, DSPParameterType } from '../types/dspTypes';
import { formatDspValue } from '../lib/utils';
import { EELParameter, EELParameterType, PluginSettings, Static } from '../types/types';

export type BackendMethod = PluginMethod | JDSPMethod;

export type PluginInitUserMethod = 'init_user';
export type PluginSetSettingMethod = 'set_settings';
export type PluginGetStaticDataMethod = 'get_static_data';
export type PluginStartJDSPMethod = 'start_jdsp';
export type PluginKillJDSPMethod = 'kill_jdsp';
export type PluginSetAppWatchMethod = 'set_app_watch';
export type PluginInitProfilesMethod = 'init_profiles';
export type PluginSetManuallyApplyProfilesMethod = 'set_manually_apply_profiles';
export type PluginFlatpakRepairMethod = 'flatpak_repair';
export type PluginGetEELParamsMethod = 'get_eel_params';
export type PluginSetEELParamMethod = 'set_eel_param';
export type PluginResetEELParamsMethod = 'reset_eel_params';
export type PluginGetVdcDbSelectionsMethod = 'get_vdc_db_selections';
export type PluginSetVdcDbSelectionMethod = 'set_vdc_db_selection';


export type PluginMethod =
    PluginInitUserMethod |
    PluginSetSettingMethod |
    PluginGetStaticDataMethod |
    PluginStartJDSPMethod |
    PluginKillJDSPMethod |
    PluginSetAppWatchMethod |
    PluginInitProfilesMethod |
    PluginSetManuallyApplyProfilesMethod |
    PluginFlatpakRepairMethod |
    PluginGetEELParamsMethod |
    PluginSetEELParamMethod |
    PluginResetEELParamsMethod |
    PluginGetVdcDbSelectionsMethod |
    PluginSetVdcDbSelectionMethod;

export type PluginMethodArgs<Method extends PluginMethod> =
    Method extends PluginInitUserMethod ? [userId: string, accountName: string, personaName: string] :
    Method extends PluginStartJDSPMethod | PluginKillJDSPMethod | PluginFlatpakRepairMethod | PluginResetEELParamsMethod | PluginGetStaticDataMethod | PluginGetVdcDbSelectionsMethod ? [] :
    Method extends PluginSetSettingMethod ? [settings: Partial<PluginSettings>] :
    Method extends PluginSetAppWatchMethod ? [appId: string, watch: boolean] :
    Method extends PluginInitProfilesMethod ? [globalPreset: string, userId: string] :
    Method extends PluginSetManuallyApplyProfilesMethod ? [useManual: boolean] :
    Method extends PluginGetEELParamsMethod ? [path: string, profileId: string] :
    Method extends PluginSetEELParamMethod ? [paramName: string, value: number] :
    Method extends PluginSetVdcDbSelectionMethod ? [vdcId: string, presetName: string] :
    never;

export type PluginMethodResponse<Method extends PluginMethod> =
    Method extends PluginInitUserMethod ? PluginSettings :
    Method extends PluginGetStaticDataMethod ? Static :
    Method extends PluginStartJDSPMethod ? boolean :
    Method extends PluginKillJDSPMethod | PluginSetSettingMethod | PluginSetAppWatchMethod | PluginSetManuallyApplyProfilesMethod | PluginFlatpakRepairMethod | PluginSetEELParamMethod | PluginResetEELParamsMethod | PluginSetVdcDbSelectionMethod ? undefined :
    Method extends PluginInitProfilesMethod ? { manualPreset: string, allPresets: string, watchedGames: { [appId: string]: boolean }, manuallyApply: boolean } :
    Method extends PluginGetEELParamsMethod ? EELParameter<EELParameterType>[] :
    Method extends PluginGetVdcDbSelectionsMethod ? { [presetName: string]: string } :
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
    private static async callPlugin<Method extends PluginMethod>(method: Method, ...args: PluginMethodArgs<Method>) {
        const response = await call<PluginMethodArgs<Method>, PluginMethodResponse<Method> | PluginMethodError>(method, ...args);
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
    static async initUser(userId: string, accountName: string, personaName: string) {
        return await this.callPlugin('init_user', userId, accountName, personaName);
    }
    static async setPluginSettings(settings: Partial<PluginSettings>) {
        return await this.callPlugin('set_settings', settings);
    }
    static async flatpakRepair() {
        return await this.callPlugin('flatpak_repair');
    }
    static async setAppWatch(appId: string, watch: boolean) {
        return await this.callPlugin('set_app_watch', appId, watch);
    }
    static async initProfiles(globalPreset: string, userId: string) {
        return await this.callPlugin('init_profiles', globalPreset, userId);
    }
    static async setManuallyApplyProfiles(useManual: boolean) {
        return await this.callPlugin('set_manually_apply_profiles', useManual);
    }
    static async getEELParams(path: string, profileId: string) {
        return await this.callPlugin('get_eel_params', path, profileId);
    }
    static async setEELParam(paramName: string, value: number) {
        return await this.callPlugin('set_eel_param', paramName, value);
    }
    static async resetEELParams() {
        return await this.callPlugin('reset_eel_params');
    }
    static async getStaticData() {
        return await this.callPlugin('get_static_data');
    }
    static async getVdcDbSelections() {
        return await this.callPlugin('get_vdc_db_selections');
    }
    static async setVdcDbSelection(vdcId: string, presetName: string) {
        return await this.callPlugin('set_vdc_db_selection', vdcId, presetName);
    }
}