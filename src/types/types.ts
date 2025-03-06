import { DSPParamSettings } from './dspTypes';
import { AppStore } from './steam/AppStore';

declare global {
    var SystemPerfStore: SystemPerfStore;
    var appStore: AppStore;
    var SteamUIStore: SteamUiStore;
    var SteamClient: SteamClient;
    var WebBrowserPlugin: WebBrowserAPi | undefined;
}
interface WebBrowserAPi {
    openInBrowser?: (url: string) => void;
};

export type OtherPluginSettings = {
    enableInDesktop: boolean;
};

export type PluginStateData = {
    jdspInstall: boolean;
    enableInDesktop: boolean;
    isDesktopMode: boolean;
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