import { call, definePlugin, routerHook } from "@decky/api"
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
import { usePluginState } from './hooks/contextHooks';
import { DSPPageTypes, getDSPPages, defineDefaultDspPageOrder, validateDSPPageOrder, DSPPageOrder } from './defines/dspPageTypeDictionary';

export default definePlugin(() => {
    routerHook.addRoute(infoRoute, () => <InfoPage />);
    PluginManager.init();
    const pagerLinker = new PagerLinker();

    const defaultDspPageOrder = defineDefaultDspPageOrder([
        DSPPageTypes.MAIN,
        DSPPageTypes.EQ,
        DSPPageTypes.COMPANDER,
        DSPPageTypes.STEREO,
        DSPPageTypes.REVERB,
        DSPPageTypes.OTHER,
        DSPPageTypes.EEL
    ]);

    const PagerWrapper: FC<{}> = ({ }) => {
        const { data, setData } = usePluginState();
        const pageOrder = validateDSPPageOrder(data?.settings.dspPageOrder);
        //@ts-ignore
        const dynamicPages = getDSPPages(pageOrder ?? defaultDspPageOrder);
        useEffect(() => { !pageOrder && setData?.((data) => !data ? data : ({ ...data, settings: { ...data.settings, dspPageOrder: defaultDspPageOrder } })) }, []);
        return (
            <QAMPager pagerLinker={pagerLinker}>
                <QAMPluginSettingsPage />
                {dynamicPages}
            </QAMPager>
        );
    };

    window.loadEel = async (path: string) => {
        return await call<string[], string>('set_eel_script', path)
    
    }

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
        },
    };
});
