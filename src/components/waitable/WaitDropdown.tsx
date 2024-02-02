import { DropdownItem, DropdownItemProps } from 'decky-frontend-lib';
import { VFC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const WaitDropdown: VFC<DropdownItemProps> = (props) => {
    const { ready } = usePluginContext();

    return <DropdownItem {...props} disabled={!ready || props.disabled} />;
};