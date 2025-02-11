import { ToggleField, ToggleFieldProps } from '@decky/ui';
import { FC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const WaitToggle: FC<ToggleFieldProps> = (props) => {
    const { ready } = usePluginContext();

    return <ToggleField {...props} disabled={!ready || props.disabled} />;
};