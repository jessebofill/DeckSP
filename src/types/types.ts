import { DSPPageOrder } from '../defines/dspPageTypeDictionary';
import { DSPParamSettings } from './dspTypes';
import { AppStore } from './steam/AppStore';

declare global {
    var SystemPerfStore: SystemPerfStore;
    var appStore: AppStore;
    var SteamUIStore: SteamUiStore;
    var SteamClient: SteamClient;
    var WebBrowserPlugin: WebBrowserAPI | undefined;
}
interface WebBrowserAPI {
    openInBrowser?: (url: string) => void;
};

export type PluginSettings = {
    enableInDesktop: boolean;
    dspPageOrder: DSPPageOrder;
};

export type PluginStateData = {
    jdspInstall: boolean;
    isDesktopMode: boolean;
    settings: PluginSettings;
};

export type PluginData = {
    dsp?: DSPParamSettings;
    plugin?: PluginStateData;
    errors: { dsp?: Error, plugin?: Error };
};

export enum ProfileType {
    Game,
    User
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

export enum EUIMode {
    Unknown = -1,
    GamePad = 4,
    Desktop = 7,
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