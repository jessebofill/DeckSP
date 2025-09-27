import { findModuleExport } from '@decky/ui';
import { CSSProperties, FC } from 'react';

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

export const AppImage: FC<AppImageProps> = findModuleExport(e => e.prototype?.GetSourcesForAsset);