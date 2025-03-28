import { DSPRangeParameter, DSPCompanderParameters, DSPParameterCompResponse, DSPParameterEQParameters, DSPEQParameters, DSPScaledParameter, DSPMappedParameter, DSPPathParameter } from '../types/dspTypes';

export const dspParameters = [
    //Master
    'master_enable',
    'master_postgain',

    //Limiter
    'master_limrelease',
    'master_limthreshold',

    //Dynamic Bass Boost
    'bass_enable',
    'bass_maxgain',

    //Analog Modeling
    'tube_enable',
    'tube_pregain',

    //Dynamic Range Compander
    'compander_enable',
    'compander_timeconstant',
    'compander_granularity',
    'compander_response',

    //Crossfeed
    'crossfeed_enable',
    'crossfeed_mode',
    'crossfeed_bs2b_fcut',
    'crossfeed_bs2b_feed',

    //Wideness
    'stereowide_enable',
    'stereowide_level',

    //Reverb
    'reverb_enable',
    'reverb_bassboost',
    'reverb_decay',
    'reverb_delay',
    'reverb_finaldry',
    'reverb_finalwet',
    'reverb_lfo_spin',
    'reverb_lfo_wander',
    'reverb_lpf_bass',
    'reverb_lpf_damp',
    'reverb_lpf_input',
    'reverb_lpf_output',
    'reverb_osf',
    'reverb_reflection_amount',
    'reverb_reflection_factor',
    'reverb_reflection_width',
    'reverb_wet',
    'reverb_width',

    //EQ
    'tone_enable',
    'tone_eq',

    //EEL Script
    'liveprog_enable',
    'liveprog_file'

] as const;

type units = 'db' | 'hz' | 'ms' | 's' | 'x' | '%' | '' | string[];
type FileTypes = 'eel';

type DefineTypeRange  = { label: string, limits: [number, number], units: units, step: number };
type DefineTypeMapped = { label: string, map: { [name: string]: number } };
type DefineTypePath = { label: string, exts: FileTypes[] };

type ParameterControlDefines =
    { [Param in DSPRangeParameter]: DefineTypeRange } &
    { [Param in DSPMappedParameter]: DefineTypeMapped } &
    { [Param in DSPPathParameter]: DefineTypePath } &
    { [Param in DSPParameterCompResponse]: { [NestedParam in keyof DSPCompanderParameters]: DefineTypeRange } } &
    { [Param in DSPParameterEQParameters]: { [NestedParam in keyof DSPEQParameters]: DefineTypeRange } };


export const dspParamDefines: ParameterControlDefines = {
    master_postgain: { label: 'Post Gain', limits: [-15, 15], units: 'db', step: 1 },

    master_limrelease: { label: 'Release', limits: [2, 500], units: 'ms', step: 1 },
    master_limthreshold: { label: 'Threshold', limits: [-60, 0], units: 'db', step: 1 },

    bass_maxgain: { label: 'Max Gain', limits: [3, 15], units: 'db', step: 1 },

    //scaled
    tube_pregain: { label: 'Preamp Gain', limits: [-3, 12], units: 'db', step: 1 },

    compander_timeconstant: { label: 'Time Constant', limits: [0.06, 0.3], units: 's', step: 0.01 },
    compander_granularity: {
        label: 'Granularity', limits: [0, 4], units:
            ['Very Low',
                'Low',
                'Medium',
                'High',
                'Extreme'], step: 1
    },
    compander_response: {
        '95': { label: '95 HZ', limits: [-1.2, 1.2], units: '', step: 0.01 },
        '200': { label: '200 HZ', limits: [-1.2, 1.2], units: '', step: 0.01 },
        '400': { label: '400 HZ', limits: [-1.2, 1.2], units: '', step: 0.01 },
        '800': { label: '800 HZ', limits: [-1.2, 1.2], units: '', step: 0.01 },
        '1600': { label: '1600 HZ', limits: [-1.2, 1.2], units: '', step: 0.01 },
        '3400': { label: '3400 HZ', limits: [-1.2, 1.2], units: '', step: 0.01 },
        '7500': { label: '7500 HZ', limits: [-1.2, 1.2], units: '', step: 0.01 }
    },

    //Crossfeed
    crossfeed_mode: {
        label: 'Mode', map: {
            'BS2B Custom': 99,
            'BS2B Weak': 0,
            'BS2B Strong': 1,
            'Out of head': 2,
            'Surround 1': 3,
            'Surround 2': 4,
            'Joe0Bloggs realistic surround': 5,
        }
    },
    crossfeed_bs2b_fcut: { label: 'Cut Frequency', limits: [300, 2000], units: 'hz', step: 10 },
    //scaled
    crossfeed_bs2b_feed: { label: 'Crossfeed', limits: [1, 15], units: 'db', step: 0.1 },

    //Wideness
    stereowide_level: { label: 'Widen Level', limits: [30, 75], units: '', step: 1 },

    //Reverb
    reverb_bassboost: { label: 'Bass Boost', limits: [0, 0.5], units: '', step: 0.01 },
    reverb_decay: { label: 'Decay', limits: [0.1, 30], units: 's', step: 0.1 },
    reverb_delay: { label: 'Delay', limits: [-500, 500], units: 'ms', step: 1 },
    reverb_finaldry: { label: 'Final Dry Mix', limits: [-70, 10], units: 'db', step: 1 },
    reverb_finalwet: { label: 'Final Wet Mix', limits: [-70, 10], units: 'db', step: 1 },
    reverb_lfo_spin: { label: 'LFO Spin Amount', limits: [0, 10], units: '', step: 0.1 },
    reverb_lfo_wander: { label: 'LFO Wander Amount', limits: [0.1, 0.6], units: '', step: 0.01 },
    reverb_lpf_bass: { label: 'Lowpass Cutoff Bass', limits: [50, 1050], units: 'hz', step: 10 },
    reverb_lpf_damp: { label: 'Lowpass Cutoff Damp', limits: [200, 18000], units: 'hz', step: 100 },
    reverb_lpf_input: { label: 'Lowpass Cuttoff Input', limits: [200, 18000], units: 'hz', step: 100 },
    reverb_lpf_output: { label: 'Lowpass Cutoff Output', limits: [200, 18000], units: 'hz', step: 100 },
    reverb_osf: { label: 'Oversampling Factor', limits: [1, 4], units: 'x', step: 1 },
    //scaled
    reverb_reflection_amount: { label: 'Early Reflection Amount', limits: [0, 100], units: '%', step: 1 },
    reverb_reflection_factor: { label: 'Early Reflection Factor', limits: [0.5, 2.5], units: '', step: 0.01 },
    reverb_reflection_width: { label: 'Early Reflection Width', limits: [-1, 1], units: '', step: 0.01 },
    reverb_wet: { label: 'Wetness', limits: [-70, 10], units: 'db', step: 1 },
    //scaled
    reverb_width: { label: 'Width L/R Mix', limits: [0, 100], units: '%', step: 1 },

    //EQ
    tone_eq: {
        '25': { label: '25 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '40': { label: '40 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '63': { label: '63 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '100': { label: '100 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '160': { label: '160 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '250': { label: '250 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '400': { label: '400 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '630': { label: '630 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '1000': { label: '1000 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '1600': { label: '1600 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '2500': { label: '2500 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '4000': { label: '4000 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '6300': { label: '6300 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '10000': { label: '10000 HZ', limits: [-12, 12], units: 'db', step: 0.1 },
        '16000': { label: '16000 HZ', limits: [-12, 12], units: 'db', step: 0.1 }
    },

    //EEL
    'liveprog_file': { label: 'Script', exts: ['eel'] }
};

export const dspScaledParams: { [Param in DSPScaledParameter]: number } = {
    tube_pregain: 0.01,
    crossfeed_bs2b_feed: 0.1,
    reverb_reflection_amount: 100,
    reverb_width: 100
};
