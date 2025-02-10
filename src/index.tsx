import { definePlugin } from "@decky/api"
import { RiEqualizerLine } from "react-icons/ri";
import { PluginManager } from './controllers/PluginManager';
import { PagerLinker, QAMPager } from './components/qam/QAMPager';
import { QAMTitleView } from './components/qam/QAMTitleView';
import { PLUGIN_NAME } from './defines/pluginName';
import { QAMDspCompanderPage, QAMDspEQPage, QAMDspMainPage, QAMDspOtherPage, QAMDspReverbPage, QAMDspStereoPage } from './components/qam/QAMDspPages';
import { QAMPluginSettingsPage } from './components/qam/QAMPluginSettingsPage';
import { QAMDataProvider } from './components/qam/QAMDataProvider';
import { profileManager } from './controllers/ProfileManager';

export default definePlugin(() => {
    // serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
    //     exact: true,
    // });
    PluginManager.start();
    
    const pagerLinker = new PagerLinker();
    window.proMan = profileManager;
    // window.getPy =  () => Backend.checkpy().then(res => console.log('res', res))


    return {
        name: 'DeckSP',
        titleView: (
            <QAMTitleView title={PLUGIN_NAME} pagerLinker={pagerLinker} />
        ),
        title: <></>,
        content: (
            <QAMDataProvider>
                    <QAMPager
                        pagerLinker={pagerLinker}
                        pages={[
                            <QAMPluginSettingsPage />,
                            <QAMDspMainPage />,
                            <QAMDspEQPage />,
                            <QAMDspCompanderPage />,
                            <QAMDspStereoPage />,
                            <QAMDspReverbPage />,
                            <QAMDspOtherPage />
                        ]}
                    />
            </QAMDataProvider>
        ),
        alwaysRender: true,
        icon: <RiEqualizerLine />,
        onDismount() {
            profileManager.activeGameReactionDisposer?.();
            // serverApi.routerHook.removeRoute("/decky-plugin-test");
        },
    };
});
