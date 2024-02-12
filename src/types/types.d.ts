import { DSPParamSettings } from './dspTypes';

declare global {
    var SystemPerfStore: SystemPerfStore;
    var appStore: AppStore;
    var SteamUIStore: SteamUiStore;
}

type PluginStateData = {
    jdspInstall: boolean;
};

type PluginData = {
    dsp?: DSPParamSettings;
    plugin?: PluginStateData;
    errors: { dsp?: Error, plugin?: Error };
};
