import { DialogButton, Dropdown, DropdownOption, Focusable, ModalRoot, SingleDropdownOption, TextField } from '@decky/ui';
import { FC, useMemo, useState } from 'react';
import { PresetToken, profileManager } from '../../controllers/ProfileManager';
import { OtherUserProfileDropdownOptionData, useOtherUsersProfilesMultiDropdownOption, useProfileMultiDropdownOptions } from '../../hooks/useProfileMultiDropdownOptions';
import { toast } from '../../lib/utils';

interface CopyFromOption extends SingleDropdownOption {
    data: string | undefined | OtherUserProfileDropdownOptionData;
}

interface NewProfileModalProps {
    onConfirm?: (profileName: string) => void;
    closeModal?: () => void;
}

export const NewProfileModal: FC<NewProfileModalProps> = ({ onConfirm, closeModal }) => {
    const [name, setName] = useState('');

    const defaultOption = { label: 'Default', data: PresetToken.DEFAULT_SUFFIX };
    const currentOption = { label: 'Current', data: undefined };
    const [copyFrom, setCopyFrom] = useState<Partial<OtherUserProfileDropdownOptionData>>({ profileId: defaultOption.data });
    const [selected, setSelected] = useState<CopyFromOption['data']>(defaultOption.data);
    const options = useMemo(() => {
        const options: DropdownOption[] = useProfileMultiDropdownOptions();
        const otherUsers = useOtherUsersProfilesMultiDropdownOption();
        options.unshift(defaultOption, currentOption);
        if (otherUsers) options.push(otherUsers)
        return options;
    }, []);

    const onSubmit = async () => {
        if (!Object.keys(profileManager.currentUserProfiles).includes(name)) {
            const { user, profileId } = copyFrom;
            await profileManager.createCustomProfile(name, profileId, user);
            onConfirm?.(name);
            closeModal?.();
        } else {
            toast('Cannot Create Profile', 'A profile with this name already exists');
        }
    };

    const onSelectCopyFrom = ({ data }: CopyFromOption) => {
        setSelected(data);
        setCopyFrom(typeof data === 'string' || data === undefined ? { profileId: data } : data);
    };

    const getUserName = () => {
        if (copyFrom.user) {
            const account = profileManager.otherUsers[copyFrom.user]?.name;
            const persona = profileManager.otherUsers[copyFrom.user]?.persona;
            return ` ${persona === undefined || account === undefined ? copyFrom.user : `${persona} (${account})`}`;
        }
        return '';
    };

    return (
        <ModalRoot
            onCancel={closeModal}
        >
            <div className='DialogHeader'>New Custom Profile</div>
            <div className='DialogLabel'>Profile Name</div>
            <TextField
                value={name}
                onChange={e => setName(e.target.value)}
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
                    <div style={{ paddingLeft: '2px', marginBottom: '0', fontSize: '10px' }} className='DialogLabel'>{`Copy from${getUserName()}:`}</div>
                    <Dropdown selectedOption={selected} rgOptions={options} onChange={onSelectCopyFrom} />
                </div>
            </Focusable>
        </ModalRoot>
    );
};
