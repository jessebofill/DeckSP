import { DialogButton, Dropdown, DropdownOption, Focusable, Marquee, Menu, MenuGroup, MenuItem, ModalRoot, MultiDropdownOption, PanelSection, PanelSectionRow, SingleDropdownOption, TextField, gamepadContextMenuClasses, showContextMenu, showModal } from 'decky-frontend-lib';
import { VFC, useEffect, useState } from 'react';
import { usePerGameProfileState } from '../../hooks/usePerGameProfileState';
import { WaitToggle } from '../waitable/WaitToggle';
import { addClasses, getActiveAppId } from '../../lib/utils';
import { profileManager, globalAppId } from '../../controllers/ProfileManager';
import { QAMUnderTitleHider } from '../qam/QAMUnderTitleHider';
import { AppArtworkAssetType, AppImage } from '../native/AppImage';
import { Log } from '../../lib/log';
import { observer } from 'mobx-react-lite';
import { useManualProfilesState } from '../../hooks/useManualProfilesState';
import { useProfileMultiDropdownOptions } from '../../hooks/useProfileMultiDropdownOptions';
import { CustomDropdownClasses } from '../generic/CustomDropdown';
import { CustomButton } from '../generic/CustomButton';
import { usePluginContext } from '../../hooks/contextHooks';
import { FaGlobeAsia } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { PluginManager } from '../../controllers/PluginManager';

export const ProfileSettings: VFC<{}> = observer(({ }) => {
    const { checked: perGameGecked, onChange: onChangePerGame } = usePerGameProfileState();
    const { useManual, onChangeUseManual, manualProfileId, onChangeManualProfile } = useManualProfilesState();
    if (!onChangePerGame || !onChangeUseManual) return null;

    return (
        <PanelSection title='Profiles'>
            <QAMUnderTitleHider />
            <div style={{ padding: '5px 0' }}>
                <CurrentProfile />
            </div>
            {getActiveAppId() !== globalAppId && !useManual &&
                <PanelSectionRow>
                    <WaitToggle label='Use per-game profile' checked={perGameGecked} onChange={onChangePerGame} bottomSeparator='none' />
                </PanelSectionRow>
            }
            <PanelSectionRow>
                <WaitToggle label='Manually apply profile' checked={useManual} onChange={onChangeUseManual} />
            </PanelSectionRow>
            {useManual && (
                <PanelSectionRow>
                    <ManualProfilesDropdown selectedOption={manualProfileId} onSelectProfile={onChangeManualProfile} />
                </PanelSectionRow>
            )}
        </PanelSection>
    );
});
// gamepadcontextmenu_Selected_1PnET
export const CurrentProfile: VFC<CurrentProfileTextProps> = observer(({ useMarquee }) => {
    Log.log('rendering current profile')

    const isGame = profileManager.activeProfileId !== globalAppId && Object.keys(profileManager.profiles).includes(profileManager.activeProfileId);
    const appOverview = isGame ? appStore.GetAppOverviewByAppID(profileManager.activeProfileIdNumber) : undefined;
    //auto profile indicator
    //user / game profile indicator

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {profileManager.activeProfileId === globalAppId ? (
                <div style={{ height: '22px', display: 'flex', alignItems: 'center' }}>
                    <FaGlobeAsia size='19px' fill='#999696' />
                </div>
            ) : appOverview && (
                <AppImage
                    style={{ width: '22px' }}
                    app={appOverview}
                    eAssetType={AppArtworkAssetType.Icon}
                    className={'perf_Icon_1op4w'}
                    bShortDisplay={true}
                />
            )}
            <CurrentProfileText useMarquee={useMarquee} />
        </div>
    );
});

interface CurrentProfileTextProps {
    useMarquee?: boolean;
}

export const CurrentProfileText: VFC<CurrentProfileTextProps> = ({ useMarquee }) => {
    const containerClass = 'profile-name-container';
    const text = `Using ${profileManager.activeProfile?.name} profile`;

    return (
        <div
            className={containerClass}
            style={{
                color: '#b8bcbf',
                fontSize: '12px',
                fontWeight: 'normal'
            }}
        >
            <style>{`
                .${containerClass} > div {
                    display: grid;
                }
            `}</style>
            {useMarquee ?
                (
                    <Marquee center={true} play={true}>
                        {text}
                    </Marquee>
                ) : text
            }
        </div>
    );
};

interface NewProfileModalProps {
    onConfirm?: (profileName: string) => void;
    closeModal?: () => void;
}

export const NewProfileModal: VFC<NewProfileModalProps> = ({ onConfirm, closeModal }) => {
    const [name, setName] = useState('');

    const defaultOption = { label: 'Default', data: 'default' };
    const [copyFrom, setCopyFrom] = useState(defaultOption.data);

    const options: DropdownOption[] = useProfileMultiDropdownOptions();
    options.unshift(defaultOption);

    const onSubmit = () => {
        if (!Object.keys(profileManager.profiles).includes(name)) {
            //todo need to await this
            profileManager.createUserProfile(name, copyFrom);
            onConfirm?.(name);
            closeModal?.();
        } else {
            PluginManager.toast('Cannot Create Profile', 'A profile with this name already exists');
        }
    };

    return (
        <ModalRoot
            onCancel={closeModal}
        >
            <div className='DialogHeader'>New Custom Profile</div>
            <div className='DialogLabel'>Profile Name</div>
            <TextField value={name} placeholder="Enter a name for the profile" onChange={e => setName(e.target.value)} />
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

    const separator = <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
    const menuItems = profileOptions.map(mapOptions);
    menuItems.splice(-1, 0, separator);

    return (
        <CustomButton
            containerClassName={addClasses(CustomDropdownClasses.topLevel)}
            style={{ padding: '10px 16px' }}
            noAudio={true}
            onClick={() => {
                showContextMenu(
                    <Menu label={'Profiles'} >
                        {menuItems}
                    </Menu>
                )
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