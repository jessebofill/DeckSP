import { Field, FieldProps, showModal } from 'decky-frontend-lib';
import { VFC } from 'react';
import { useSetDefaults } from '../../hooks/useSetDefaults';
import { DestructiveModal } from '../generic/DestructiveModal';
import { profileManager } from '../../controllers/ProfileManager';
import { WaitButton } from '../waitable/WaitButton';

export interface SetDefaultsButtonProps {
    bottomSeparator?: FieldProps['bottomSeparator'];
}

export const SetDefaultsButton: VFC<SetDefaultsButtonProps> = ({ }) => {
    const setDefaults = useSetDefaults();
    return (
        <Field
            label={
                <WaitButton
                    onClick={() => showModal(<ConfirmSetDefaultModal onConfirm={setDefaults} />)}
                >
                    Reset to defaults
                </WaitButton>
            } />
    );
};

interface ConfirmSetDefaultModalProps {
    onConfirm?: () => void;
    closeModal?: () => void;
}

const ConfirmSetDefaultModal: VFC<ConfirmSetDefaultModalProps> = ({ onConfirm, closeModal }) => {
    const profileName = profileManager.activeProfile?.name ?? '';

    return (
        <DestructiveModal
            closeModal={closeModal}
            onOK={() => { onConfirm?.() }}
            strTitle={`Resetting ${profileName} to defaults`}
            strDescription={'Are you sure you want to reset this profile to defaults?'}
        />
    );
};