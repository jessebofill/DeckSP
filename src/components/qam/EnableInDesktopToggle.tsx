import { FC } from 'react'
import { WaitToggle } from '../waitable/WaitToggle'
import { usePluginState } from '../../hooks/contextHooks';
import { useToggleDesktop } from '../../hooks/useToggleDesktop';

export const EnableInDesktopToggle: FC<{}> = () => {
    const { data } = usePluginState();
    if (!data) return;
    return <WaitToggle label='Enable in Desktop Mode' checked={data.enableInDesktop} onChange={useToggleDesktop()} bottomSeparator={'none'} />;
}