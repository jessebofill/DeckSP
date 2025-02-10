import { ConfirmModal, ConfirmModalProps, gamepadDialogClasses } from '@decky/ui';
import { FC } from 'react';

export interface DestructiveModalProps extends Omit<ConfirmModalProps, 'bDestructiveWarning'> {

}

export const DestructiveModal: FC<DestructiveModalProps> = ({ className, ...props }) => {
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
