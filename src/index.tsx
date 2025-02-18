import { definePlugin, routerHook } from "@decky/api"
import { RiEqualizerLine } from "react-icons/ri";
import { PluginManager } from './controllers/PluginManager';
import { PagerLinker, QAMPager } from './components/qam/QAMPager';
import { QAMTitleView } from './components/qam/QAMTitleView';
import { infoRoute, PLUGIN_NAME } from './defines/constants';
import { QAMDspCompanderPage, QAMDspEQPage, QAMDspMainPage, QAMDspOtherPage, QAMDspReverbPage, QAMDspStereoPage } from './components/qam/QAMDspPages';
import { QAMPluginSettingsPage } from './components/qam/QAMPluginSettingsPage';
import { QAMDataProvider } from './components/qam/QAMDataProvider';
import { profileManager } from './controllers/ProfileManager';
import { InfoPage } from './components/routePages/InfoPage';
import { QAMStyles } from './components/qam/QAMStyles';

export default definePlugin(() => {
    routerHook.addRoute(infoRoute, () => <InfoPage/>);
    PluginManager.init();
    const pagerLinker = new PagerLinker();

    return {
        name: PLUGIN_NAME,
        titleView: <QAMTitleView title={PLUGIN_NAME} pagerLinker={pagerLinker} />,
        title: <></>,
        content: (
            <QAMDataProvider>
                <QAMPager pagerLinker={pagerLinker}>
                    <QAMPluginSettingsPage />
                    <QAMDspMainPage />
                    <QAMDspEQPage />
                    <QAMDspCompanderPage />
                    <QAMDspStereoPage />
                    <QAMDspReverbPage />
                    <QAMDspOtherPage />
                </QAMPager>
                <QAMStyles/>
            </QAMDataProvider>
        ),
        alwaysRender: true,
        icon: <RiEqualizerLine />,
        onDismount() {
            profileManager.activeGameReactionDisposer?.();
            routerHook.removeRoute(infoRoute);
        },
    };
});
