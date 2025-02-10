import { DialogButton, DialogButtonProps,  } from '@decky/ui';
import { FC17 } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const WaitButton: FC17<DialogButtonProps> = (props) => {
    const { ready } = usePluginContext();

    return <DialogButton {...props} disabled={!ready || props.disabled} />;
};