import { PluginManager } from '../controllers/PluginManager';
import { usePluginState } from './contextHooks';
import { useWaiter } from './useWaiter';

export type DeleteProfileType = (profileId: string) => Promise<string | Error>;

export function useToggleDesktop() {
    const { data, setData, setError } = usePluginState();
    if (!data || !setData || !setError) return;
    return useWaiter((enable: boolean) => PluginManager.setEnableInDestop(enable), (res) => res instanceof Error ? setError(res) : setData({ ...data, enableInDesktop: res.enable, isDesktopMode: res.isCurrentUI }));
};