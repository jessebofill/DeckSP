
export enum ReverbPresetTableParamMap {
    'reverb_osf',
    'reverb_finalwet',
    'reverb_finaldry',
    'reverb_wet',
    'reverb_reflection_amount',
    'reverb_reflection_factor',
    'reverb_reflection_width',
    'reverb_width',
    'reverb_bassboost',
    'reverb_lfo_wander',
    'reverb_lfo_spin',
    'reverb_lpf_input',
    'reverb_lpf_bass',
    'reverb_lpf_damp',
    'reverb_lpf_output',
    'reverb_decay',
    'reverb_delay'
};

export const reverbPresetTable = {
    presets: {          //OSF  Wet  Dry  RWet ERAmt ERFac ERWdth Wdth  BassB Wander Spin  InpLP  BasLP  DmpLP  OutLP  Decay Delay
        'Default':       [1,  -9.0,  -7,   0,  40,  1.6,  0.7,   100,  0.15, 0.25,  0.7,  17000,  500,  7000,  10000, 3.2,  20  ],
        'Small Hall 1':  [1,  -9.0,  -7,  -8,  30,  1.0,  0.7,   100,  0.25, 0.3,   0.7,  18000,  600,  9000,  17000, 2.1,  10  ],
        'Small Hall 2':  [1,  -9.0,  -7,  -8,  30,  1.0,  0.7,   100,  0.2,  0.25,  0.5,  18000,  600,  7000,  9000,  2.3,  10  ],
        'Medium Hall 1': [1,  -9.0,  -7,  -8,  30,  1.2,  0.7,   100,  0.2,  0.25,  0.7,  18000,  500,  8000,  16000, 2.8,  10  ],
        'Medium Hall 2': [1,  -9.0,  -7,  -8,  30,  1.2,  0.7,   100,  0.15, 0.2,   0.5,  18000,  500,  6000,  8000,  2.9,  10  ],
        'Large Hall 1':  [1,  -9.0,  -7,  -8,  20,  1.4,  0.7,   100,  0.2,  0.15,  1.0,  18000,  400,  9000,  14000, 3.8,  18  ],
        'Large Hall 2':  [1,  -9.0,  -7,  -8,  20,  1.5,  0.7,   100,  0.2,  0.2,   0.5,  18000,  400,  5000,  7000,  4.2,  18  ],
        'Small Room 1':  [1,  -8.0,  -7,  -8,  70,  0.7,  -0.4,  80,   0.3,  0.2,   1.6,  18000,  1000, 18000, 18000, 0.5,  5   ],
        'Small Room 2':  [1,  -8.0,  -7,  -8,  70,  0.8,  0.6,   90,   0.3,  0.3,   0.4,  18000,  300,  10000, 18000, 0.5,  5   ],
        'Medium Room 1': [1,  -8.0,  -7,  -8,  50,  1.2,  -0.4,  80,   0.1,  0.2,   1.6,  18000,  1000, 18000, 18000, 0.8,  8   ],
        'Medium Room 2': [1,  -8.0,  -7,  -8,  50,  1.2,  0.6,   90,   0.1,  0.3,   0.4,  18000,  300,  10000, 18000, 1.2,  16  ],
        'Large Room 1':  [1,  -8.0,  -7,  -8,  20,  2.2,  -0.4,  90,   0.1,  0.2,   1.6,  18000,  1000, 16000, 18000, 1.8,  10  ],
        'Large Room 2':  [1,  -8.0,  -7,  -8,  20,  2.2,  0.6,   90,   0.1,  0.3,   0.4,  18000,  500,  9000,  18000, 1.9,  20  ],
        'Medium ER 1':   [1,  -7.0,  -6, -70,  50,  1.2,  -0.4,  80,   0.1,  0.2,   1.6,  18000,  1000, 18000, 18000, 0.8,  8   ],
        'Medium ER 2':   [1,  -7.0,  -6, -70,  50,  1.2,  0.6,   90,   0.1,  0.3,   0.4,  18000,  300,  10000, 18000, 1.2,  16  ],
        'Plate High':    [2,  -30.0, -12, -8,  0 ,  1.0,  1.0,   100,  0.1,  0.2,   1.6,  18000,  1000, 16000, 18000, 1.8,  0   ],
        'Plate Low':     [2,  -30.0, -12, -8,  0 ,  1.0,  1.0,   100,  0.2,  0.3,   0.4,  18000,  500,  9000,  18000, 1.9,  0   ],
        'Long Reverb 1': [2,  -16.0, -14, -5,  10,  1.0,  0.1,   100,  0.05, 0.35,  1.0,  18000,  100,  10000, 18000, 12.0, 0   ],
        'Long Reverb 2': [2,  -16.0, -14, -5,  10,  1.0,  0.1,   100,  0.05, 0.4,   1.0,  18000,  100,  9000,  18000, 30.0, 0   ]
    },
    paramMap: ReverbPresetTableParamMap
} as const;

