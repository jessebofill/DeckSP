import { DropdownItem, DropdownItemProps } from '@decky/ui';
import { FC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const WaitDropdown: FC<DropdownItemProps> = (props) => {
    const { ready } = usePluginContext();

    return <DropdownItem {...props} disabled={!ready || props.disabled} />;
};