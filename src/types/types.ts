import { DSPPageOrder } from '../defines/dspPageTypeDictionary';
import { DSPParamSettings } from './dspTypes';

declare global {
    var SystemPerfStore: SystemPerfStore;
    var appStore: AppStore;
    var SteamUIStore: SteamUiStore;
    var SteamClient: SteamClient;
    var WebBrowserPlugin: WebBrowserAPI | undefined;
    var App: App;
}

interface WebBrowserAPI {
    openInBrowser?: (url: string) => void;
};

export type Static = {
    vdcDb: VdcDb;
    userMap: { [userId: string]: [accountName: string, personaName: string] };
};

export type PluginSettings = {
    enableInDesktop: boolean;
    dspPageOrder: DSPPageOrder;
    disableProfileToasts: boolean;
};

export type PluginStateData = {
    jdspInstall: boolean;
    isDesktopMode: boolean;
    settings: PluginSettings;
    vdcDbSelections: { [presetName: string]: string };
};

export type PluginData = {
    dsp?: DSPParamSettings;
    plugin?: PluginStateData;
    errors: { dsp?: Error, plugin?: Error };
};

export enum ProfileType {
    Game,
    Custom
};

export type Profile<Type extends ProfileType> = {
    id: string;
    get name(): string;
    type: Type;
};

export enum FlatpakFixState {
    Default,
    Busy,
    Done,
    Error
};

export enum EELParameterType {
    SLIDER = 'range',
    LIST = 'list'
};

export type EELParameter<T extends EELParameterType> = {
    type: T;
    variable_name: string;
    default_value: number;
    min: number;
    max: number;
    step: number;
    description: string;
    current_value: number;
} & (T extends EELParameterType.LIST ? { options: string[] } : {});

export type VdcDbEntry = {
    ID: string;
    Model: string;
    Company: string;
};

export type VdcDb = VdcDbEntry[];