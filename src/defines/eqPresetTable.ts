const EQPresetTableParamMap = {};

(function (EQPresetTableParamMap) {
    EQPresetTableParamMap[EQPresetTableParamMap['25'] = 0] = '25',
    EQPresetTableParamMap[EQPresetTableParamMap['40'] = 1] = '40',
    EQPresetTableParamMap[EQPresetTableParamMap['63'] = 2] = '63',
    EQPresetTableParamMap[EQPresetTableParamMap['100'] = 3] = '100',
    EQPresetTableParamMap[EQPresetTableParamMap['160'] = 4] = '160',
    EQPresetTableParamMap[EQPresetTableParamMap['250'] = 5] = '250',
    EQPresetTableParamMap[EQPresetTableParamMap['400'] = 6] = '400',
    EQPresetTableParamMap[EQPresetTableParamMap['630'] = 7] = '630',
    EQPresetTableParamMap[EQPresetTableParamMap['1000'] = 8] = '1000',
    EQPresetTableParamMap[EQPresetTableParamMap['1600'] = 9] = '1600',
    EQPresetTableParamMap[EQPresetTableParamMap['2500'] = 10] = '2500',
    EQPresetTableParamMap[EQPresetTableParamMap['4000'] = 11] = '4000',
    EQPresetTableParamMap[EQPresetTableParamMap['6300'] = 12] = '6300',
    EQPresetTableParamMap[EQPresetTableParamMap['10000'] = 13] = '10000',
    EQPresetTableParamMap[EQPresetTableParamMap['16000'] = 14] = '16000'
})(EQPresetTableParamMap);

export const eqPresetTable = {
    presets: {          //25     40     63     100    160    250    400    630   1000   1600   2500   4000   6300   10000   16000
        'Default':       [0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0     ],
        'Pop':           [0,     0,     0,     0,     0,     1.3,   2,     2.5,   5,     -1.5,  -2,    -3,    -3,    -3,    -3    ],
        'Rock':          [0,     0,     0,     3,     3,     -10,   -4,    -1,    0.8,   3,     3,     3,     3,     3,     3     ],
        'Jazz':          [0,     0,     0,     2,     4,     5.9,   -5.9,  -4.5,  -2.5,  2.5,   1,     -0.8,  -0.8,  -0.8,  -0.8  ],
        'Classic':       [-0.3,  0.3,   -3.5,  -9,    -1,    0,     1.8,   2.1,   0,     0,     0,     4.4,   9,     9,     9     ],
        'Bass':          [10,    8.8,   8.5,   6.5,   2.5,   1.5,   0,     0,     0,     0,     0,     0,     0,     0,     0     ],
        'Clear':         [3.5,   5.5,   6.5,   9.5,   8,     6.5,   3.5,   2.5,   1.3,   5,     7,     9,     10,    11,    9     ],
        'Hip-Hop':       [4.5,   4.3,   4,     2.5,   1.5,   3,     -1,    -1.5,  -1.5,  1.5,   0,     -1,    0,     1.5,   3     ],
        'Dubstep':       [12,    10,    0.5,   -1,    -3,    -5,    -5,    -4.8,  -4.5,  -2.5,  -1,    0,     -2.5,  -2.5,  0     ],
        'Movie':         [3,     3,     6.1,   8.5,   9,     7,     6.1,   6.1,   5,     8,     3.5,   3.5,   8,     10,    8     ],
        'Metal':         [10.5,  10.5,  7.5,   0,     2,     5.5,   0,     0,     0,     6.1,   0,     0,     6.1,   10,    12    ],    
        'Vocal Booster': [-1.5,  -2,    -3,    -3,    -0.5,  1.5,   3.5,   3.5,   3.5,   3,     2,     1.5,   0,     0,     -1.5  ],
        'Hardstyle':     [6.1,   7,     12,    6.1,   -5,    -12,   -2.5,  3,     6.5,   0,     -2.2,  -4.5,  -6.1,  -9.2,  -10   ],
        'Acoustic':      [5,     4.5,   4,     3.5,   1.5,   1,     1.5,   1.5,   2,     3,     3.5,   4,     3.7,   3,     3     ],
        'R&B':           [3,     3,     7,     6.1,   4.5,   1.5,   -1.5,  -2,    -1.5,  2,     2.5,   3,     3.5,   3.8,   4     ],
        'Electronic':    [4,     4,     3.5,   1,     0,     -0.5,  -2,    0,     2,     0,     0,     1,     3,     4,     4.5   ],
        'Deep Bass':     [12,    8,     0,     -6.7,  12,    -9,    -3.5,  -3.5,  -6.1,  0,     -3,    -5,    0,     1.2,   3     ],
        'Beats':         [-5.5,  -5,    -4.5,  -4.2,  3.5,   -3,    -1.9,  0,     0,     0,     0,     0,     0,     0,     0     ]
    },
    paramMap: EQPresetTableParamMap
} as const

