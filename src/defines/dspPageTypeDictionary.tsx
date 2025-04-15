import { QAMDspMainPage, QAMDspEQPage, QAMDspCompanderPage, QAMDspStereoPage, QAMDspReverbPage, QAMDspBassTubePage, QAMDspEELPage, QAMDspDDCConvolverPage } from '../components/qam/pager/QAMDspPages';

export const dspPageDict = {
    MAIN: {
        element: <QAMDspMainPage />,
        displayName: 'Master/ Limiter'
    },
    EQ: {
        element: <QAMDspEQPage />,
        displayName: 'Equalizer'
    },
    COMPANDER: {
        element: <QAMDspCompanderPage />,
        displayName: 'Compander'
    },
    STEREO: {
        element: <QAMDspStereoPage />,
        displayName: 'Stereo'
    },
    REVERB: {
        element: <QAMDspReverbPage />,
        displayName: 'Reverb'
    },
    BASS_TUBE: {
        element: <QAMDspBassTubePage />,
        displayName: 'Bass Boost/ Tube Modeling'
    },
    EEL: {
        element: <QAMDspEELPage />,
        displayName: 'EEL Script'
    },
    DDC_CONVOLVER: {
        element: <QAMDspDDCConvolverPage />,
        displayName: 'ViPER-DDC/ Convolver'
    },
} as const;

export const DSPPageTypes = Object.fromEntries(
    Object.keys(dspPageDict).map((key) => [key, key])
) as { [K in keyof typeof dspPageDict]: K };

export type DSPPageType = typeof DSPPageTypes[keyof typeof DSPPageTypes];

type Permutation<T, U = T> = [T] extends [never]
    ? []
    : T extends any
    ? [T, ...Permutation<Exclude<U, T>>]
    : never;

export type DSPPageOrder = Permutation<DSPPageType>;

export function getDSPPages(pages: DSPPageOrder) {
    return pages.map(p => dspPageDict[p].element);
}
let defaultOrder = Object.keys(dspPageDict) as DSPPageOrder;
export function defineDefaultDspPageOrder(order: DSPPageOrder): DSPPageOrder {
    defaultOrder = [...order];
    return order;
}
export function getDefaultDSPPageOrder(): DSPPageOrder {
    return defaultOrder;
}
export function validateDSPPageOrder(order?: DSPPageOrder): DSPPageOrder | undefined {
    if (!order) return;
    if ((Object.keys(DSPPageTypes) as DSPPageOrder).every(pageType => order.includes(pageType)) &&
        order.every(pageType => Object.keys(DSPPageTypes).includes(pageType))) {
        return order;
    } else {
        return;
    }
}