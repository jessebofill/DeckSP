import { FC } from 'react'
import { WaitToggle } from '../waitable/WaitToggle'
import { usePluginStateContext } from '../../hooks/contextHooks';
import { useUpdateSetting } from '../../hooks/useUpdateSetting';

export const DisableProfileToastsToggle: FC<{}> = () => {
    const { data } = usePluginStateContext();
    if (!data) return;
    return <WaitToggle label='Disable profile notifications' checked={data.settings.disableProfileToasts} onChange={useUpdateSetting('disableProfileToasts')} />;
}