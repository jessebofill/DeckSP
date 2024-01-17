import { definePlugin, quickAccessMenuClasses, ServerAPI } from "decky-frontend-lib";
import { RiEqualizerLine } from "react-icons/ri";
import { QAMDspSettings } from './components/qam/QAMDspSettings';
import { DspSettingsContext } from './hooks/contextHooks';
import { AsyncDataProvider } from './components/generic/AsyncDataProvider';
import { PluginManager } from './controllers/PluginManager';
import { PagerLinker, QAMPager, QAMPageSwitcher } from './components/qam/QAMPager';
import { DSPParamSettings } from './types/dspTypes';
import { handleDspSettings } from './controllers/asyncDataHandlers';
import { PLUGIN_NAME } from './defines/pluginName';
import { QAMDspCompanderPage, QAMDspEQPage, QAMDspMainPage, QAMDspOtherPage, QAMDspReverbPage, QAMDspStereoPage } from './components/qam/QAMPages';


export default definePlugin((serverApi: ServerAPI) => {
    // serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
    //     exact: true,
    // });

    PluginManager.start(serverApi);
    const pagerLinker = new PagerLinker();

    return {
        titleView: <QAMPageSwitcher title={PLUGIN_NAME} pagerLinker={pagerLinker} />,
        title: <></>,
        content: (
            <AsyncDataProvider<DSPParamSettings>
            handler={handleDspSettings}
            Context={DspSettingsContext}
            containerClass={quickAccessMenuClasses.QuickAccessMenu}
        >
            <QAMPager
                pagerLinker={pagerLinker}
                pages={[
                    <QAMDspMainPage />,
                    <QAMDspEQPage />,
                    <QAMDspCompanderPage />,
                    <QAMDspStereoPage />,
                    <QAMDspReverbPage />,
                    <QAMDspOtherPage />
                ]}
            />
            </AsyncDataProvider>
        ),
        alwaysRender: true,
        icon: <RiEqualizerLine />,
        onDismount() {
            // serverApi.routerHook.removeRoute("/decky-plugin-test");
        },
    };
});
