import { ServerAPI } from 'decky-frontend-lib';
import { parseJDSPAll, parseJDSPParam, stringifyNestedParams } from '../lib/parseDspParams';
import { DSPParameter, DSPParameterCompResponse, DSPParameterEQParameters, DSPParameterType, DSPScaledParameter } from '../types/dspTypes';
import { Log } from '../lib/log';
import { dspScaledParams } from '../defines/dspParameterDefines';

export type BackendMethod =
    'set' |
    'get' |
    // 'get_multiple' |
    'get_all';

type ParamSendValueType<Param extends DSPParameter> =
    Param extends DSPParameterCompResponse | DSPParameterEQParameters ?
    string :
    DSPParameterType<Param>;


export type MethodArgs<T extends BackendMethod, Param extends DSPParameter = never> =
    T extends 'set' ? { parameter: Param, value: ParamSendValueType<Param> } :
    T extends 'get' ? { parameter: Param } :
    // T extends 'get_multiple' ? { parameters: DSPParameter[] } :
    T extends 'get_all' ? {} :
    never;

type GetMultiParamsResult = {
    [Param in DSPParameter]?: string;
};

export interface JDSPResponse<T extends BackendMethod> {
    jdsp_result: T extends 'get_multiple' ? GetMultiParamsResult : string;
    jdsp_error: string;
}

export class Backend {
    private static serverAPI: ServerAPI;

    static init(serverApi: ServerAPI) {
        this.serverAPI = serverApi;
    }

    static async startJDSP() {
        const response = await this.serverAPI.callPluginMethod<{}, {}>('start_jdsp', {});
        if (response.success) {
            return true;
        } else {
            throw new Error(`Backend responded with '${response.result}'`);
        }
    }

    private static async callJDSP<Method extends BackendMethod, Param extends DSPParameter>(method: Method, args: MethodArgs<Method, Param>) {
        const response = await this.serverAPI.callPluginMethod<MethodArgs<Method, Param>, JDSPResponse<Method>>(method, args);
        Log.log('response ', response)
        if (response.success) {
            if (!!response.result.jdsp_error) throw new Error(response.result.jdsp_error)
            else return response.result.jdsp_result;
        } else {
            throw new Error(`Backend responded with '${response.result}'`);
        }
    }

    static async setDsp<Param extends DSPParameter>(parameter: Param, value: DSPParameterType<Param>) {
        const val = parameter === 'compander_response' || parameter === 'tone_eq' ?
            stringifyNestedParams(value as DSPParameterType<DSPParameterCompResponse | DSPParameterEQParameters>) :
            dspScaledParams[parameter as any] !== undefined ? (value as number) / dspScaledParams[parameter as DSPScaledParameter] : value;

        return await this.callJDSP('set', { parameter, value: val as ParamSendValueType<Param> });
    }

    static async getDsp<Param extends DSPParameter>(parameter: Param): Promise<DSPParameterType<Param>> {
        return parseJDSPParam(parameter, await this.callJDSP('get', { parameter }));
    }

    static async getDspAll() {
        return parseJDSPAll(await this.callJDSP('get_all', {}));
    }

    static async test() {
        return await this.serverAPI.callPluginMethod('test', {})
    }

    // static async getMultiple<Params extends DSPParameter>(parameters: Params[]): Promise<Pick<Required<MultiParams>, Params>> {
    //     const res = await this.call('get_multiple', { parameters })
    //     console.log('res', res)
    //     return parseJDSPMultiParams(res);
    // }

    // static async readSettings() {
    //     return await this.getMultiple(Array.from(dspParameters));
    // }
}