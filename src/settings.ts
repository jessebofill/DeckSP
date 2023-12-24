interface CompanderParameters {
    '95': number,
    '200': number,
    '400': number,
    '800': number,
    '1600': number,
    '3400': number,
    '7500': number
}

interface DSPParameters {
    master_enable: boolean,
    master_limrelease: number,
    master_limthreshold: number,
    
    bass_enable: boolean,   //Dynamic Bass Boost
    bass_maxgain: number,

    compander_enable: boolean,
    compander_granularity: number,
    compander_response: CompanderParameters

    
    
}