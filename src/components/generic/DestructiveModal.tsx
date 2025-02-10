import { ConfirmModal, ConfirmModalProps, gamepadDialogClasses } from '@decky/ui';
import { FC17 } from 'react';

export interface DestructiveModalProps extends Omit<ConfirmModalProps, 'bDestructiveWarning'> {

}

export const DestructiveModal: FC17<DestructiveModalProps> = ({ className, ...props }) => {
    const rootClass = 'destructive-modal';

    return (
        <>
            <style>{`.${rootClass} button.${gamepadDialogClasses.Button}.DialogButton.gpfocus.Primary {
                background: #de3618;
                color: #fff
            }`}</style>
            <ConfirmModal
                className={rootClass + (className ? ` ${className}` : '')}
                {...props}
            />
        </>
    );
};
