import { ToggleField, ToggleFieldProps } from '@decky/ui';
import { VFC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const WaitToggle: VFC<ToggleFieldProps> = (props) => {
    const { ready } = usePluginContext();

    return <ToggleField {...props} disabled={!ready || props.disabled} />;
};