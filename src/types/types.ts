import { DSPParamSettings } from './dspTypes';
import { AppStore } from './steam/AppStore';

declare global {
    var SystemPerfStore: SystemPerfStore;
    var appStore: AppStore;
    var SteamUIStore: SteamUiStore;
}

export type PluginStateData = {
    jdspInstall: boolean;
};

export type PluginData = {
    dsp?: DSPParamSettings;
    plugin?: PluginStateData;
    errors: { dsp?: Error, plugin?: Error };
};

export enum ProfileType {
    Game,
    User
}

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