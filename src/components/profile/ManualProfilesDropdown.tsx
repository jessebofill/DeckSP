import { DropdownOption, Menu, MenuGroup, MenuItem, MultiDropdownOption, SingleDropdownOption, gamepadContextMenuClasses, showContextMenu, showModal } from 'decky-frontend-lib';
import { VFC, useEffect, useState } from 'react';
import { addClasses } from '../../lib/utils';
import { useProfileMultiDropdownOptions } from '../../hooks/useProfileMultiDropdownOptions';
import { CustomDropdownClasses } from '../generic/CustomDropdown';
import { CustomButton } from '../generic/CustomButton';
import { usePluginContext } from '../../hooks/contextHooks';
import { FaPlus } from "react-icons/fa6";
import { NewProfileModal } from './NewProfileModalProps';

interface ManualProfilesDropdownProps {
    selectedOption: any;
    onSelectProfile?: (profileId: string) => void;
}

export const ManualProfilesDropdown: VFC<ManualProfilesDropdownProps> = ({ selectedOption: selectedOptionData, onSelectProfile }) => {
    const icon = <svg style={{ height: '1em', margin: 'auto' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none"><path d="M17.98 26.54L3.20996 11.77H32.75L17.98 26.54Z" fill="currentColor"></path></svg>;
    const { ready } = usePluginContext();
    const profileOptions: DropdownOption[] = useProfileMultiDropdownOptions();
    const [selected, setSelected] = useState<SingleDropdownOption | undefined>(findMatchedOptionRecursive(profileOptions, selectedOptionData));

    const newProfileOption = {
        label: <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaPlus size={'9px'} />
            New Custom Profile
        </div>,
        data: 'newprofile'
    };

    profileOptions.push(newProfileOption);

    useEffect(() => {
        if (selected?.data !== selectedOptionData) {
            setSelected(findMatchedOptionRecursive(profileOptions, selectedOptionData));
        }
    }, [selectedOptionData, profileOptions.length]);

    const onOptionChange = (option: SingleDropdownOption) => {
        setSelected(option);
        onSelectProfile?.(option.data);
    };

    const onSelect = (option: SingleDropdownOption) => {
        if (option.data === newProfileOption.data) showModal(<NewProfileModal onConfirm={profileName => onOptionChange({ label: profileName, data: profileName })} />);
        else onOptionChange(option);
    };

    const mapOptions = (option: SingleDropdownOption | MultiDropdownOption) => !option.options ?
        <MenuItem selected={option.data === selected?.data} onClick={() => onSelect(option)} onOKActionDescription={option.data === newProfileOption.data ? 'Create Custom Profile' : 'Apply Profile'}>
            {option.label}
        </MenuItem> :
        //@ts-ignore
        <MenuGroup label={option.label} className={addClasses(option.options.find(option => option.data === selected?.data) && gamepadContextMenuClasses.Selected)}>
            {option.options.map(mapOptions)}
        </MenuGroup>;

    const separator = <div className={gamepadContextMenuClasses.ContextMenuSeparator} />;
    const menuItems = profileOptions.map(mapOptions);
    menuItems.splice(-1, 0, separator);

    return (
        <CustomButton
            containerClassName={addClasses(CustomDropdownClasses.topLevel)}
            style={{ padding: '10px 16px' }}
            noAudio={true}
            onClick={() => {
                showContextMenu(
                    <Menu label={'Profiles'}>
                        {menuItems}
                    </Menu>
                );
            }}
            disabled={!ready}
        >
            <div style={{ display: 'flex', overflow: 'hidden' }}>
                <div style={{ overflow: 'hidden', flex: 'auto' }}>
                    <div style={{ textAlign: 'left', minHeight: '20px' }} className={CustomDropdownClasses.label}>
                        {selected?.label ?? 'Choose Profile'}
                    </div>
                </div>
                <div style={{ display: 'flex', marginLeft: '1ch', flex: 'none' }}>
                    {icon}
                </div>
            </div>
        </CustomButton>
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
