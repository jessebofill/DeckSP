import { ReactNode, FC, useState } from 'react';
import { DestructiveModal } from '../generic/DestructiveModal';
import { FadeSpinner } from '../generic/FadeSpinner';

interface DeleteProfileModalProps {
    profileName: ReactNode;
    onConfirm?: () => void;
    closeModal?: () => void;
}
export const DeleteProfileModal: FC<DeleteProfileModalProps> = ({ profileName, onConfirm, closeModal }) => {
    const [ready, setReady] = useState(true);

    return (
        <DestructiveModal
            closeModal={closeModal}
            onOK={async () => {
                setReady(false);
                await onConfirm?.();
            }}
            strTitle={`Deleting ${profileName}`}
        >
            {ready ?
                'Are you sure you want to delete this profile?' :
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FadeSpinner style={{ display: 'flex' }} isLoading={!ready} />
                </div>}
        </DestructiveModal>
    );
};
