import { DialogButton, Dropdown, DropdownOption, Focusable, ModalRoot, TextField } from '@decky/ui';
import { FC, useState } from 'react';
import { profileManager } from '../../controllers/ProfileManager';
import { useProfileMultiDropdownOptions } from '../../hooks/useProfileMultiDropdownOptions';
import { toast } from '../../lib/utils';

interface NewProfileModalProps {
    onConfirm?: (profileName: string) => void;
    closeModal?: () => void;
}

export const NewProfileModal: FC<NewProfileModalProps> = ({ onConfirm, closeModal }) => {
    const [name, setName] = useState('');

    const defaultOption = { label: 'Default', data: 'default' };
    const currentOption = { label: 'Current', data: undefined };
    const [copyFrom, setCopyFrom] = useState(defaultOption.data);

    const options: DropdownOption[] = useProfileMultiDropdownOptions();
    options.unshift(defaultOption, currentOption);

    const onSubmit = async () => {
        if (!Object.keys(profileManager.currentUserProfiles).includes(name)) {
            await profileManager.createCustomProfile(name, copyFrom);
            onConfirm?.(name);
            closeModal?.();
        } else {
            toast('Cannot Create Profile', 'A profile with this name already exists');
        }
    };

    return (
        <ModalRoot
            onCancel={closeModal}
        >
            <div className='DialogHeader'>New Custom Profile</div>
            <div className='DialogLabel'>Profile Name</div>
            <TextField value={name} onChange={e => setName(e.target.value)}
                //@ts-ignore
                placeholder="Enter a name for the profile"
            />
            <Focusable style={{ display: 'flex', flexDirection: 'row', marginTop: '5px', alignItems: 'flex-end', gap: '20px' }}>
                <DialogButton
                    style={{ maxHeight: '40px' }}
                    onClick={onSubmit}
                    disabled={name.length === 0}
                >
                    Create Profile
                </DialogButton>
                <div style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ paddingLeft: '2px', marginBottom: '0', fontSize: '10px' }} className='DialogLabel'> Copy from...</div>
                    <Dropdown selectedOption={copyFrom} rgOptions={options} onChange={option => setCopyFrom(option.data)} />
                </div>
            </Focusable>
        </ModalRoot>
    );
};
