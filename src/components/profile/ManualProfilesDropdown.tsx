import { Field, Menu, MenuGroup, MenuItem, MultiDropdownOption, SingleDropdownOption, gamepadContextMenuClasses, showContextMenu, showModal } from '@decky/ui';
import { FC, createContext, useContext, useEffect, useState } from 'react';
import { addClasses, playUISound } from '../../lib/utils';
import { useGameProfileMultiDropdownOption, useProfileMultiDropdownOptions, useCustomProfileMultiDropdownOption } from '../../hooks/useProfileMultiDropdownOptions';
import { CustomButton } from '../generic/CustomButton';
import { usePluginContext } from '../../hooks/contextHooks';
import { FaPlus } from "react-icons/fa6";
import { NewProfileModal } from './NewProfileModal';
import { DeleteProfileType, useDeleteProfile } from '../../hooks/useDeleteProfile';
import { ProfileType } from '../../types/types';
import { DeleteProfileModal } from './DeleteProfileModal';

interface ManualProfilesDropdownProps {
    selectedOption: any;
    onSelectProfile?: (profileId: string) => void;
}

export const ManualProfilesDropdown: FC<ManualProfilesDropdownProps> = ({ selectedOption: selectedOptionData, onSelectProfile }) => {
    const icon = <svg style={{ height: '1em', margin: 'auto' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none"><path d="M17.98 26.54L3.20996 11.77H32.75L17.98 26.54Z" fill="currentColor"></path></svg>;
    const { ready } = usePluginContext();
    const profileOptions = useProfileMultiDropdownOptions();
    const [selected, setSelected] = useState<SingleDropdownOption | undefined>(findMatchedOptionRecursive(profileOptions, selectedOptionData));

    useEffect(() => {
        if (selected?.data !== selectedOptionData) setSelected(findMatchedOptionRecursive(profileOptions, selectedOptionData));
    }, [selectedOptionData, profileOptions[0].options.length, profileOptions[1]?.options.length]);

    const onSelectOption = (option: SingleDropdownOption) => {
        setSelected(option);
        onSelectProfile?.(option.data);
    };

    const deleteProfile = useDeleteProfile();

    return (
        <Field label={
            <CustomButton
                containerStyle={{ width: '100%' }}
                style={{ padding: '10px 16px' }}
                noAudio={true}
                onClick={() => showContextMenu(<ProfileMenu selected={selected} deleteProfile={deleteProfile} onSelectOption={onSelectOption} />)}
                disabled={!ready}
            >
                <div style={{ display: 'flex', overflow: 'hidden' }}>
                    <div style={{ overflow: 'hidden', flex: 'auto' }}>
                        <div style={{ textAlign: 'left', minHeight: '20px' }}>
                            {selected?.label ?? 'Choose Profile'}
                        </div>
                    </div>
                    <div style={{ display: 'flex', marginLeft: '1ch', flex: 'none' }}>
                        {icon}
                    </div>
                </div>
            </CustomButton >
        }
            bottomSeparator='none'
        />
    );
};
function findMatchedOptionRecursive(options: (SingleDropdownOption | MultiDropdownOption)[], toMatchOptionData: any): SingleDropdownOption | undefined {
    for (let option of options) {
        if (!option.options) {
            if (option.data === toMatchOptionData) return option;
        } else {
            const sub = findMatchedOptionRecursive(option.options, toMatchOptionData);
            if (sub !== undefined) return sub;
        }
    }
    return;
}


type ProfileMenuContextData = {
    selected?: SingleDropdownOption;
    deleteProfile?: DeleteProfileType;
    onSelectOption?: (option: SingleDropdownOption) => void;
};

interface ProfileGroupContextData extends ProfileMenuContextData {
    group: MultiDropdownOption;
    groupType: ProfileType;
    refreshGroup: () => void;
}

const ProfileGroupContext = createContext<ProfileGroupContextData | null>(null);
const ProfileMenuContext = createContext<ProfileMenuContextData | null>(null);


const ProfileMenu: FC<ProfileMenuContextData> = ({ selected, deleteProfile, onSelectOption }) => {
    return (
        <ProfileMenuContext.Provider value={{ deleteProfile, onSelectOption, selected }}>
            <Menu label={'Profiles'}>
                <ProfileMenuGroup groupType={ProfileType.Game} />
                <ProfileMenuGroup groupType={ProfileType.Custom} />
                <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
                <MenuItem onClick={() => showModal(<NewProfileModal onConfirm={profileName => onSelectOption?.({ label: profileName, data: profileName })} />)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaPlus size={'9px'} />
                        New Custom Profile
                    </div>
                </MenuItem>
            </Menu>
        </ProfileMenuContext.Provider>
    );
};

interface ProfileMenuGroupProps {
    groupType: ProfileType;
}

const ProfileMenuGroup: FC<ProfileMenuGroupProps> = ({ groupType }) => {
    const menuContext = useContext(ProfileMenuContext);
    if (!menuContext) return null;

    const { selected, deleteProfile, onSelectOption } = menuContext;
    const group = groupType === ProfileType.Game ? useGameProfileMultiDropdownOption() : useCustomProfileMultiDropdownOption();
    const [_, setState] = useState(false);

    return group?.options && group.options.length > 0 ?
        //@ts-ignore
        <MenuGroup label={group.label} className={addClasses(group.options.find(option => option.data === selected?.data) && gamepadContextMenuClasses.Selected)}>
            <ProfileGroupContext.Provider
                value={{
                    group,
                    groupType,
                    refreshGroup: () => setState(state => !state),
                    selected,
                    deleteProfile,
                    onSelectOption
                }}
            >
                <ProfileMenuItems />
            </ProfileGroupContext.Provider>
        </MenuGroup>
        : null;
};

const ProfileMenuItems: FC<{}> = ({ }) => {
    const groupContext = useContext(ProfileGroupContext);
    if (!groupContext) return null;

    const { group, groupType, refreshGroup, selected, deleteProfile, onSelectOption } = groupContext;
    const [options, setOptions] = useState(group.options);
    const isCustomGroup = groupType === ProfileType.Custom;

    return (
        <>
            {options.map(option =>
                <MenuItem
                    selected={option.data === selected?.data}
                    onClick={() => { 
                        onSelectOption?.(option as SingleDropdownOption);
                        playUISound('/sounds/deck_ui_hide_modal.wav');
                    }}
                    onOKActionDescription='Apply Profile'
                    onSecondaryButton={isCustomGroup && option.data !== selected?.data ?
                        () => showModal(
                            <DeleteProfileModal
                                profileName={option.label}
                                onConfirm={async () => {
                                    await deleteProfile?.(option.data);
                                    refreshGroup();
                                    setOptions(useCustomProfileMultiDropdownOption()?.options ?? [])
                                }}
                            />) : undefined
                    }
                    onSecondaryActionDescription={isCustomGroup && option.data !== selected?.data ? 'Delete Profile' : undefined}
                >
                    {option.label}
                </MenuItem>
            )}
        </>
    );
};