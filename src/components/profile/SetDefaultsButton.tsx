import { Field, FieldProps, showModal } from '@decky/ui';
import { FC, useEffect } from 'react';
import { useSetDefaults } from '../../hooks/useSetDefaults';
import { DestructiveModal } from '../generic/DestructiveModal';
import { profileManager } from '../../controllers/ProfileManager';
import { WaitButton } from '../waitable/WaitButton';
import { reaction } from 'mobx';

export interface SetDefaultsButtonProps {
    bottomSeparator?: FieldProps['bottomSeparator'];
}

export const SetDefaultsButton: FC<SetDefaultsButtonProps> = ({ }) => {
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

const ConfirmSetDefaultModal: FC<ConfirmSetDefaultModalProps> = ({ onConfirm, closeModal }) => {
    const profileName = profileManager.activeProfile?.name ?? '';

    useEffect(() => reaction(() => profileManager.activeProfileId, () => closeModal?.()), []);

    return (
        <DestructiveModal
            closeModal={closeModal}
            onOK={() => { onConfirm?.() }}
            strTitle={`Resetting ${profileName} to defaults`}
            strDescription={'Are you sure you want to reset this profile to defaults?'}
        />
    );
};