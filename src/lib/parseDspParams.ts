import { dspParameters, dspScaledParams } from '../defines/dspParameterDefines';
import { DSPParameter, DSPParameterType, DSPCompanderParameters, DSPEQParameters, DictParams, DSPParamSettings, DSPScaledParameter } from '../types/dspTypes';

export function parseJDSPParam<Param extends DSPParameter>(parameterName: Param, value: string): DSPParameterType<Param> {
    switch (parameterName) {
        case 'master_enable':
        case 'bass_enable':
        case 'compander_enable':
        case 'crossfeed_enable':
        case 'reverb_enable':
        case 'stereowide_enable':
        case 'tone_enable':
        case 'tube_enable':
        case 'liveprog_enable':
            return (value.toLowerCase() === 'true') as DSPParameterType<Param>;
        case 'master_postgain':
        case 'master_limrelease':
        case 'master_limthreshold':
        case 'bass_maxgain':
        case 'compander_granularity':
        case 'compander_timeconstant':
        case 'crossfeed_bs2b_fcut':
        case 'crossfeed_bs2b_feed':
        case 'crossfeed_mode':
        case 'reverb_bassboost':
        case 'reverb_decay':
        case 'reverb_delay':
        case 'reverb_finaldry':
        case 'reverb_finalwet':
        case 'reverb_lfo_spin':
        case 'reverb_lfo_wander':
        case 'reverb_lpf_bass':
        case 'reverb_lpf_damp':
        case 'reverb_lpf_input':
        case 'reverb_lpf_output':
        case 'reverb_osf':
        case 'reverb_reflection_amount':
        case 'reverb_reflection_factor':
        case 'reverb_reflection_width':
        case 'reverb_wet':
        case 'reverb_width':
        case 'stereowide_level':
        case 'tube_pregain':
            const parsed = parseFloat(value);
            return dspScaledParams[parameterName as DSPScaledParameter] !== undefined ? (dspScaledParams[parameterName as DSPScaledParameter] * parsed) as DSPParameterType<Param> : parsed as DSPParameterType<Param>;
        case 'compander_response':
            return parseJDSPCompanderParams(value) as DSPParameterType<Param>;
        case 'tone_eq':
            return parseJDSPEQParams(value) as DSPParameterType<Param>;
        case 'liveprog_file':
            return value as DSPParameterType<Param>;
        default:
            throw new Error(`Unexpected parameter: ${parameterName}`);
    }
}

function parseJDSPCompanderParams(parameters: string): DSPCompanderParameters {
    const tokens = parameters.split(/[;"]/).filter(string => string);
    const out = {} as DSPCompanderParameters;
    for (let i = 0; i < 7; i++) {
        out[parseInt(tokens[i]).toString() as keyof DSPCompanderParameters] = parseFloat(tokens[i + 7]);
    }
    return out;
}

function parseJDSPEQParams(parameters: string): DSPEQParameters {
    const tokens = parameters.split(/[;"]/).filter(string => string);
    const out = {} as DSPEQParameters;
    for (let i = 0; i < 15; i++) {
        out[parseInt(tokens[i]).toString() as keyof DSPEQParameters] = parseFloat(tokens[i + 15]);
    }
    return out;
}

export function parseJDSPMultiParams<Param extends DSPParameter>(parameters: {
    [P in Param]?: string;
}) {
    const params = {} as Pick<Required<DictParams>, Param>;
    for (const parameter in parameters) {
        params[parameter as Param] = parseJDSPParam(parameter as DSPParameter, parameters[parameter] ?? '') as Required<DictParams>[Param];
    }
    return params;
}

export function parseJDSPAll(string: string) {
    return string.split(/\n/).reduce<DictParams>((out, current) => {
        if (!current || current === '') return out;
        const [parameter, value] = current.split('=');
        if (!dspParameters.includes(parameter as any)) return out;
        return Object.assign({ [parameter]: parseJDSPParam(parameter as DSPParameter, value) }, out);
    }, {}) as DSPParamSettings;
}

export function stringifyNestedParams<Params extends DSPCompanderParameters | DSPEQParameters>(paramsObject: Params) {
    const pairs = Object.entries(paramsObject);
    const keys: string[] = [];
    const values: any[] = [];
    for (let i = 0; i < pairs.length; i++) {
        keys.push(`${pairs[i][0]}.0`);
        values.push(pairs[i][1]);
    }
    return keys.concat(values).join(';');
}