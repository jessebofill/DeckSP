import { ToggleField, ToggleFieldProps } from 'decky-frontend-lib';
import { VFC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const WaitToggle: VFC<ToggleFieldProps> = (props) => {
    const { ready } = usePluginContext();

    return <ToggleField {...props} disabled={!ready || props.disabled} />;
};