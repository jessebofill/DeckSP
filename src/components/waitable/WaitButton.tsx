import { DialogButton, DialogButtonProps,  } from '@decky/ui';
import { FC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const WaitButton: FC<DialogButtonProps> = (props) => {
    const { ready } = usePluginContext();

    return <DialogButton {...props} disabled={!ready || props.disabled} />;
};