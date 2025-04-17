import { definePlugin, routerHook } from "@decky/api"
import { RiEqualizerLine } from "react-icons/ri";
import { PluginManager } from './controllers/PluginManager';
import { PagerLinker, QAMPager } from './components/qam/pager/QAMPager';
import { QAMTitleView } from './components/qam/QAMTitleView';
import { infoRoute, PLUGIN_NAME } from './defines/constants';
import { QAMPluginSettingsPage } from './components/qam/pager/QAMPluginSettingsPage';
import { QAMDataProvider } from './components/dataProviders/QAMDataProvider';
import { profileManager } from './controllers/ProfileManager';
import { InfoPage } from './components/routePages/InfoPage';
import { QAMStyles } from './components/qam/QAMStyles';
import { FC, useEffect } from 'react';
import { usePluginStateContext } from './hooks/contextHooks';
import { DSPPageTypes, getDSPPages, defineDefaultDspPageOrder, validateDSPPageOrder, DSPPageOrder } from './defines/dspPageTypeDictionary';

export default definePlugin(() => {
    routerHook.addRoute(infoRoute, () => <InfoPage />);
    const disposePlugin = PluginManager.init();
    const pagerLinker = new PagerLinker();

    const defaultDspPageOrder = defineDefaultDspPageOrder([
        DSPPageTypes.MAIN,
        DSPPageTypes.EQ,
        DSPPageTypes.COMPANDER,
        DSPPageTypes.STEREO,
        DSPPageTypes.REVERB,
        DSPPageTypes.BASS_TUBE,
        DSPPageTypes.EEL,
        DSPPageTypes.DDC_CONVOLVER,
    ]);

    const PagerWrapper: FC<{}> = ({ }) => {
        const { data, setData } = usePluginStateContext();
        const pageOrder = validateDSPPageOrder(data?.settings.dspPageOrder);
        const dynamicPages = getDSPPages((pageOrder) as DSPPageOrder ?? defaultDspPageOrder);
        useEffect(() => { !pageOrder && setData?.((data) => !data ? data : ({ ...data, settings: { ...data.settings, dspPageOrder: defaultDspPageOrder } })) }, []);
        return (
            <QAMPager pagerLinker={pagerLinker}>
                <QAMPluginSettingsPage />
                {dynamicPages}
            </QAMPager>
        );
    };

    return {
        name: PLUGIN_NAME,
        titleView: <QAMTitleView title={PLUGIN_NAME} pagerLinker={pagerLinker} />,
        title: <></>,
        content: (
            <QAMDataProvider>
                <PagerWrapper />
                <QAMStyles />
            </QAMDataProvider>
        ),
        alwaysRender: true,
        icon: <RiEqualizerLine />,
        onDismount() {
            profileManager.activeGameReactionDisposer?.();
            routerHook.removeRoute(infoRoute);
            disposePlugin();
        },
    };
});
