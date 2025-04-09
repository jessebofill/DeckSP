import { FC } from 'react'
import { WaitToggle } from '../waitable/WaitToggle'
import { usePluginStateContext } from '../../hooks/contextHooks';
import { useUpdateSetting } from '../../hooks/useUpdateSetting';

export const EnableInDesktopToggle: FC<{}> = () => {
    const { data } = usePluginStateContext();
    if (!data) return;
    return <WaitToggle label='Enable in Desktop Mode' checked={data.settings.enableInDesktop} onChange={useUpdateSetting('enableInDesktop')} />;
}