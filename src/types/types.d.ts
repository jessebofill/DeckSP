import { DSPParamSettings } from './dspTypes';

declare global {
    var SystemPerfStore: SystemPerfStore;
    var appStore: AppStore;
    var SteamUIStore: SteamUiStore;
}

type PluginSettings = {

};

type PluginData = {
    dsp?: DSPParamSettings;
    plugin?: PluginSettings;
    errors: { dsp?: Error, plugin?: Error };
};
