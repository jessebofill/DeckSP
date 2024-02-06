import { ServerAPI } from 'decky-frontend-lib';
import { parseJDSPAll, stringifyNestedParams } from '../lib/parseDspParams';
import { DSPParameter, DSPParameterCompResponse, DSPParameterEQParameters, DSPParameterType, DSPScaledParameter } from '../types/dspTypes';
import { Log } from '../lib/log';
import { dspScaledParams } from '../defines/dspParameterDefines';
import { PluginSettings } from '../types/types';

export type BackendMethod = PluginMethod | JDSPMethod;

export type PluginStartJDSPMethod = 'start_jdsp';
export type PluginSetAppWatchMethod = 'set_app_watch';
export type PluginInitProfilesMethod = 'init_profiles';
export type PluginSetManuallyApplyProfilesMethod = 'set_manually_apply_profiles';


export type PluginMethod =
    PluginStartJDSPMethod |
    PluginSetAppWatchMethod |
    PluginInitProfilesMethod |
    PluginSetManuallyApplyProfilesMethod;

export type PluginMethodArgs<Method extends PluginMethod> =
    Method extends PluginStartJDSPMethod ? {} :
    Method extends PluginSetAppWatchMethod ? { appId: string, watch: boolean } :
    Method extends PluginInitProfilesMethod ? { globalPreset: string } :
    Method extends PluginSetManuallyApplyProfilesMethod ? { useManual: boolean } :
    never;

export type PluginMethodResponse<Method extends PluginMethod> =
    Method extends PluginStartJDSPMethod | PluginSetAppWatchMethod | PluginSetManuallyApplyProfilesMethod ? undefined :
    Method extends PluginInitProfilesMethod ? { manualPreset: string, allPresets: string, watchedGames: { [appId: string]: boolean }, manuallyApply: boolean } :
    never;

interface PluginMethodError {
    error: string;
}

export type JDSPSetMethod = 'set_jdsp_param';
export type JDSPGetAllMethod = 'get_all_jdsp_param';
export type JDSPSetDefaultsMethod = 'set_jdsp_defaults';
export type JDSPNewPresetMethod = 'new_jdsp_preset';
export type JDSPSetProfileMethod = 'set_profile';

export type JDSPMethod =
    JDSPSetMethod |
    JDSPGetAllMethod |
    JDSPSetDefaultsMethod |
    JDSPNewPresetMethod |
    JDSPSetProfileMethod;

type ParamSendValueType<Param extends DSPParameter> =
    Param extends DSPParameterCompResponse | DSPParameterEQParameters ?
    string :
    DSPParameterType<Param>;

export type JDSPMethodArgs<Method extends JDSPMethod, Param extends DSPParameter = never> =
    Method extends JDSPSetMethod ? { parameter: Param, value: ParamSendValueType<Param> } :
    Method extends JDSPGetAllMethod ? {} :
    Method extends JDSPSetDefaultsMethod ? { defaultPreset: string } :
    Method extends JDSPNewPresetMethod ? { presetName: string, fromPresetName?: string } :
    Method extends JDSPSetProfileMethod ? { presetName: string, isManual: boolean } :
    never;

export interface JDSPResponse {
    jdsp_result?: string;
    jdsp_error?: string;
}

export class Backend {
    private static serverAPI: ServerAPI;

    static init(serverApi: ServerAPI) {
        this.serverAPI = serverApi;
    }

    static async callPlugin<Method extends PluginMethod>(method: Method, args: PluginMethodArgs<Method>) {
        const response = await this.serverAPI.callPluginMethod<PluginMethodArgs<Method>, PluginMethodResponse<Method> | PluginMethodError>(method, args);
        Log.log('Backend call response ', response)
        if (response.success) {
            if ((response.result as PluginMethodError)?.error !== undefined) throw new Error(`Backend error: ${(response.result as PluginMethodError).error}`);
            return response.result as PluginMethodResponse<Method>;
        } else {
            throw new Error(`Backend responded with '${response.result}'`);
        }
    }

    private static async callJDSP<Method extends JDSPMethod, Param extends DSPParameter>(method: Method, args: JDSPMethodArgs<Method, Param>) {
        const response = await this.serverAPI.callPluginMethod<JDSPMethodArgs<Method, Param>, JDSPResponse>(method, args);
        Log.log('response ', response)
        if (response.success) {
            if (response.result.jdsp_error !== undefined) throw new Error(`JDSP error: ${response.result.jdsp_error}`);
            else return response.result.jdsp_result!;
        } else {
            throw new Error(`Backend responded with '${response.result}'`);
        }
    }

    static async checkpy() {
        return await this.serverAPI.callPluginMethod('test2', { });
    }

    //jdsp specific calls
    static async setDsp<Param extends DSPParameter>(parameter: Param, value: DSPParameterType<Param>) {
        const val = parameter === 'compander_response' || parameter === 'tone_eq' ?
            stringifyNestedParams(value as DSPParameterType<DSPParameterCompResponse | DSPParameterEQParameters>) :
            dspScaledParams[parameter as any] !== undefined ? (value as number) / dspScaledParams[parameter as DSPScaledParameter] : value;

        return await this.callJDSP('set_jdsp_param', { parameter, value: val as ParamSendValueType<Param> });
    }
    static async getDspAll() {
        return parseJDSPAll(await this.callJDSP('get_all_jdsp_param', {}));
    }
    static async setDspDefaults(defaultPreset: string) {
        return parseJDSPAll(await this.callJDSP('set_jdsp_defaults', { defaultPreset }));
    }
    static async newPreset(presetName: string, fromPresetName?: string) {
        return await this.callJDSP('new_jdsp_preset', { presetName, fromPresetName });
    }
    static async setProfile(presetName: string, isManual: boolean) {
        Log.log('set profile called');
        // const res = await this.serverAPI.callPluginMethod('set_profile', { presetName: presetName });
        // await sleep(5000);
        const res = await this.callJDSP('set_profile', { presetName, isManual });
        Log.log('set profile backend call done');
        return parseJDSPAll(res);
    }


    //general plugin calls
    static async startJDSP() {
        return await this.callPlugin('start_jdsp', {});
    }
    static async setAppWatch(appId: string, watch: boolean) {
        return await this.callPlugin('set_app_watch', { appId, watch });
    }
    static async initProfiles(globalPreset: string) {
        return await this.callPlugin('init_profiles', { globalPreset });
    }
    static async setManuallyApplyProfiles(useManual: boolean) {
        return await this.callPlugin('set_manually_apply_profiles', { useManual });
    }
    static async getSettings(): Promise<PluginSettings> {
        return await this.serverAPI.callPluginMethod('test', {});
    }
}