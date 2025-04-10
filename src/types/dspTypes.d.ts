import { dspParameters } from '../defines/dspParameterDefines'
import { EQPresetTableParamMap, eqPresetTable } from '../defines/eqPresetTable'
import { ReverbPresetTableParamMap, reverbPresetTable } from '../defines/reverbPresetTable'


//Master
export type DSPParameterMasterEnable = 'master_enable';
export type DSPParameterMasterPostGain = 'master_postgain';

//Limiter
export type DSPParameterLimitRelease = 'master_limrelease';
export type DSPParameterLimitThreshold = 'master_limthreshold';

//Dynamic Bass Boost
export type DSPParameterBassEnable = 'bass_enable';
export type DSPParameterBassMaxGain = 'bass_maxgain';

//Analog Modeling
export type DSPParameterTubeEnable = 'tube_enable';
export type DSPParameterTubePreGain = 'tube_pregain';

//Dynamic Range Compander
export type DSPParameterCompEnable = 'compander_enable';
export type DSPParameterCompTimeConstant = 'compander_timeconstant';
export type DSPParameterCompGranularity = 'compander_granularity';
export type DSPParameterCompResponse = 'compander_response';

//Crossfeed
export type DSPParameterCrossfeedEnable = 'crossfeed_enable';
export type DSPParameterCrossfeedMode = 'crossfeed_mode';
export type DSPParameterCrossfeedCut = 'crossfeed_bs2b_fcut';
export type DSPParameterCrossfeedFeed = 'crossfeed_bs2b_feed';

//Wideness
export type DSPParameterWideEnable = 'stereowide_enable';
export type DSPParameterWideLevel = 'stereowide_level';

//Reverb
export type DSPParameterReverbEnable = 'reverb_enable';
export type DSPParameterReverbBassBoost = 'reverb_bassboost';
export type DSPParameterReverbDecay = 'reverb_decay';
export type DSPParameterReverbDelay = 'reverb_delay';
export type DSPParameterReverbFWet = 'reverb_finaldry';
export type DSPParameterReverbFDry = 'reverb_finalwet';
export type DSPParameterReverbLFOSPin = 'reverb_lfo_spin';
export type DSPParameterReverbLFOWander = 'reverb_lfo_wander';
export type DSPParameterReverbLPFBass = 'reverb_lpf_bass';
export type DSPParameterReverbLPFDamp = 'reverb_lpf_damp';
export type DSPParameterReverbLPFIn = 'reverb_lpf_input';
export type DSPParameterReverbLPFOut = 'reverb_lpf_output';
export type DSPParameterReverbOSF = 'reverb_osf';
export type DSPParameterReverbERAmount = 'reverb_reflection_amount';
export type DSPParameterReverbERFactor = 'reverb_reflection_factor';
export type DSPParameterReverbERWidth = 'reverb_reflection_width';
export type DSPParameterReverbWet = 'reverb_wet';
export type DSPParameterReverbWidth = 'reverb_width';

//EQ
export type DSPParameterEQEnable = 'tone_enable';
export type DSPParameterEQParameters = 'tone_eq';

//EEL
export type DSPParameterEELScriptEnable = 'liveprog_enable';
export type DSPParameterEELScriptPath = 'liveprog_file';

export type DSPEQParameters = {
    '25': number;
    '40': number;
    '63': number;
    '100': number;
    '160': number;
    '250': number;
    '400': number;
    '630': number;
    '1000': number;
    '1600': number;
    '2500': number;
    '4000': number;
    '6300': number;
    '10000': number;
    '16000': number;
};

export type DSPCompanderParameters = {
    '95': number;
    '200': number;
    '400': number;
    '800': number;
    '1600': number;
    '3400': number;
    '7500': number;
};

export type DSPParameter = typeof dspParameters[number]

export type DSPBooleanParameter =
    DSPParameterMasterEnable |
    DSPParameterBassEnable |
    DSPParameterTubeEnable |
    DSPParameterCompEnable |
    DSPParameterCrossfeedEnable |
    DSPParameterWideEnable |
    DSPParameterReverbEnable |
    DSPParameterEQEnable |
    DSPParameterEELScriptEnable;

export type DSPRangeParameter =
    DSPParameterMasterPostGain |
    DSPParameterLimitRelease |
    DSPParameterLimitThreshold |
    DSPParameterBassMaxGain |
    DSPParameterTubePreGain |
    DSPParameterCompTimeConstant |
    DSPParameterCompGranularity |
    DSPParameterCrossfeedCut |
    DSPParameterCrossfeedFeed |
    DSPParameterWideLevel |
    DSPParameterReverbBassBoost |
    DSPParameterReverbDecay |
    DSPParameterReverbDelay |
    DSPParameterReverbFWet |
    DSPParameterReverbFDry |
    DSPParameterReverbLFOSPin |
    DSPParameterReverbLFOWander |
    DSPParameterReverbLPFBass |
    DSPParameterReverbLPFDamp |
    DSPParameterReverbLPFIn |
    DSPParameterReverbLPFOut |
    DSPParameterReverbOSF |
    DSPParameterReverbERAmount |
    DSPParameterReverbERFactor |
    DSPParameterReverbERWidth |
    DSPParameterReverbWet |
    DSPParameterReverbWidth;

export type DSPPathParameter = DSPParameterEELScriptPath;

export type DSPMappedParameter = DSPParameterCrossfeedMode;

export type DSPScaledParameter = DSPParameterTubePreGain | DSPParameterCrossfeedFeed | DSPParameterReverbERAmount | DSPParameterReverbWidth;

export type DSPParameterType<T extends DSPParameter> =
    T extends DSPBooleanParameter ? boolean :
    T extends DSPRangeParameter | DSPMappedParameter ? number :
    T extends DSPParameterCompResponse ? DSPCompanderParameters :
    T extends DSPParameterEQParameters ? DSPEQParameters :
    T extends DSPPathParameter ? string :
    never;

export type DictParams = {
    [Param in DSPParameter]?: DSPParameterType<Param>;
};

export type DSPParamSettings = Required<DictParams>;

export type PresetSectionTypeReverb = 'reverb';
export type PresetSectionTypeEQ = 'eq';
export type PresetSectionType = PresetSectionTypeReverb | PresetSectionTypeEQ;

export type PresetTable<PresetType extends PresetSectionType> =
    PresetType extends PresetSectionTypeReverb ? typeof reverbPresetTable :
    PresetType extends PresetSectionTypeEQ ? typeof eqPresetTable :
    never;

// export type PresetTableParamMap<Type extends PresetSectionType> =
//     Type extends PresetSectionTypeReverb ? typeof ReverbPresetTableParamMap :
//     Type extends PresetSectionTypeEQ ? typeof EQPresetTableParamMap :
//     never;

// export type PresetTableParams<Type extends PresetSectionType> =
//     Type extends PresetSectionTypeReverb ? keyof typeof ReverbPresetTableParamMap :
//     Type extends PresetSectionTypeEQ ? keyof typeof EQPresetTableParamMap :
//     never;