import { findModuleChild, Module } from 'decky-frontend-lib';
import { CSSProperties, VFC } from 'react';

export enum AppArtworkAssetType {
    Capsule,
    Hero,
    Logo,
    Header,
    Icon,
    HeroBlur,
}

interface AppImageProps {
    app?: AppOverview;
    appid?: number;
    className?: string;
    rgSources?: string[];
    name?: string;
    eAssetType?: AppArtworkAssetType;
    onIncrementalError?: (a: unknown, b: unknown, c: unknown) => void;
    suppressTransitions?: boolean;
    neverShowTitle?: boolean;
    bShortDisplay?: boolean;
    backgroundType?: 'transparent';
    imageClassName?: string;
    allowCustomization?: boolean;
    style?: CSSProperties;
}

export const AppImage: VFC<AppImageProps> = findModuleChild((m: Module) => {
    if (typeof m !== "object") return undefined;
    for (let prop in m) {
        if (m[prop]?.prototype?.GetSourcesForAsset) return m[prop];
    }
});