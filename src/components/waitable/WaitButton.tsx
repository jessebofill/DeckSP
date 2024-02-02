import { DialogButton, DialogButtonProps,  } from 'decky-frontend-lib';
import { VFC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const WaitButton: VFC<DialogButtonProps> = (props) => {
    const { ready } = usePluginContext();

    return <DialogButton {...props} disabled={!ready || props.disabled} />;
};