import { FC, useEffect, useMemo } from 'react';
import { useDspSettingsContext, usePluginStateContext, useStaticContext } from '../../../hooks/contextHooks';
import { Field, FieldProps, gamepadContextMenuClasses, Menu, MenuGroup, MenuItem, PanelSection, PanelSectionRow, showContextMenu } from '@decky/ui';
import { profileManager } from '../../../controllers/ProfileManager';
import { VdcDbEntry } from '../../../types/types';
import { CustomButton } from '../../generic/CustomButton';
import { EffectInfo } from '../../other/EffectInfo';
import { ParameterToggle } from '../base/ParameterToggle';
import { openFilePicker, FileSelectionType } from '@decky/api';
import { dspParamDefines } from '../../../defines/dspParameterDefines';
import { reaction } from 'mobx';
import { Backend } from '../../../controllers/Backend';
import { useWaiter } from '../../../hooks/useWaiter';
import { useError } from '../../../lib/utils';

type Selection = {
    type: 'fs' | 'db';
    identifier: string;
};

type OrganizedDb = {
    [brand: string]: VdcDbEntry[];
}

export const ViperDDCControls: FC<{}> = ({ }) => {
    return (
        <PanelSection title='ViPER-DDC'>
            <EffectInfo effect='viper'>
                <PanelSectionRow>
                    <ParameterToggle parameter='ddc_enable' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <VdcSelector />
                </PanelSectionRow>
            </EffectInfo>
        </PanelSection>
    );
};

interface VdcSelectorProps extends Pick<FieldProps, 'bottomSeparator'> { };

export const VdcSelector: FC<VdcSelectorProps> = ({ bottomSeparator }) => {
    const vdcProxyPath = '/home/deck/.var/app/me.timschneeberger.jdsp4linux/config/jamesdsp/temp.vdc';
    const { data: pluginState, setData: setPluginState } = usePluginStateContext();
    const { data: dsp, setData: setDsp, setError: setDspError } = useDspSettingsContext();
    const { vdcDb } = useStaticContext();
    if (!dsp || !setDsp || !setDspError || !pluginState || !setPluginState || !vdcDb) return;

    const db = useMemo(() => organizeDb(vdcDb), []);
    let label = 'Select...';
    let message = '';

    if (dsp.ddc_file === vdcProxyPath) {
        const selectedDbId = pluginState.vdcDbSelections[profileManager.activeProfilePresetName];
        const selectedDbEntry = vdcDb.find(entry => entry.ID === selectedDbId);
        if (selectedDbEntry) {
            label = `${selectedDbEntry.Company}: ${selectedDbEntry.Model}`;
            message = 'From database';
        } else {
            message = `ID: ${selectedDbId} does not exist in database`;
        }
    } else {
        if (dsp.ddc_file !== '') {
            const fileName = dsp.ddc_file.split('/').at(-1);
            if (fileName && fileName.endsWith('.vdc')) {
                label = fileName;
                message = 'From file system';
            } else {
                message = `Invalid selection: ${dsp.ddc_file}`;
            }
        }
    }

    const onSelect = useWaiter(async ({ identifier: indentifier, type }: Selection) => {
        switch (type) {
            case 'db':
                const preset = profileManager.activeProfilePresetName;
                const dbRes = await Backend.setVdcDbSelection(indentifier, preset).catch(e => useError('Failed to set vdc db selection', e))
                if (dbRes instanceof Error) return setDspError(dbRes);
                setDsp(dsp => ({ ...dsp!, ddc_file: vdcProxyPath }));
                setPluginState(data => ({ ...data!, vdcDbSelections: { ...data!.vdcDbSelections, [preset]: indentifier } }));
                break;
            case 'fs':
                const fsRes = await Backend.setDsp('ddc_file', indentifier).catch(e => useError('Failed to set jdsp ddc_file', e))
                if (fsRes instanceof Error) return setDspError(fsRes);
                setDsp(dsp => ({ ...dsp!, ddc_file: indentifier }));
        }
    })!;

    return (
        <Field
            label={dspParamDefines['ddc_file'].label}
            description={<div style={{ wordWrap: 'break-word' }}>{message}</div>}
            childrenLayout='below'
            bottomSeparator={bottomSeparator ?? 'none'}
        >
            <CustomButton
                style={{ padding: '10px 16px' }}
                noAudio={true}
                onClick={() => showMenu(db, onSelect)}
            >
                <div style={{ display: 'flex', overflow: 'hidden' }}>
                    <div style={{ overflow: 'hidden', flex: 'auto' }}>
                        <div style={{ minHeight: '20px', textAlign: 'left' }}>
                            {label}
                        </div>
                    </div>
                    <div style={{ display: 'flex', marginLeft: '1ch', flex: 'none' }}>
                        <svg style={{ height: '1em', margin: 'auto' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none"><path d="M17.98 26.54L3.20996 11.77H32.75L17.98 26.54Z" fill="currentColor"></path></svg>
                    </div>
                </div>
            </CustomButton>
        </Field>
    );
};

interface VdcMenuProps {
    db: OrganizedDb;
    onSelect: (selection: Selection) => void;
    closeMenu: () => void;
};

const VdcMenu: FC<VdcMenuProps> = ({ db, onSelect, closeMenu }) => {
    useEffect(() => reaction(() => profileManager.activeProfileId, () => closeMenu()), [profileManager.activeProfileId, closeMenu]);

    const dbMenuGroup = useMemo(() =>
        <MenuGroup label='From database...'>
            {Object.entries(db).map(([brand, models]) =>
                <MenuGroup label={brand}>
                    {models.map(entry => <MenuItem onClick={() => onSelect({ type: 'db', identifier: entry.ID })}>{entry.Model}</MenuItem>)}
                </MenuGroup>
            )}
        </MenuGroup>
        , []);

    return (
        <Menu label='Select DDC source'>
            <MenuItem onClick={() => showFilePicker(onSelect, () => showMenu(db, onSelect))}>
                From file...
            </MenuItem>
            <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
            {dbMenuGroup}
        </Menu>
    );
};

const showMenu = (db: OrganizedDb, onSelect: (selection: Selection) => void) => {
    let menu: { Hide: () => void };
    const menuElement = <VdcMenu db={db} onSelect={onSelect} closeMenu={() => menu.Hide()} />;
    //@ts-ignore
    menu = showContextMenu(menuElement);
};

const showFilePicker = async (onSelect: (selection: Selection) => void, onCancel: () => void) => {
    const { exts, start } = dspParamDefines['ddc_file'];
    let userCancelled = true;
    const dispose = reaction(() => profileManager.activeProfileId,
        () => {
            userCancelled = false;
            SteamClient.Input.ControllerKeyboardSetKeyState(EHIDKeyboardKey.Escape, true);
            SteamClient.Input.ControllerKeyboardSetKeyState(EHIDKeyboardKey.Escape, false);
        });
    try {
        const file = await openFilePicker(FileSelectionType.FILE, start, true, true, undefined, [...exts], false, false)
        onSelect({ type: 'fs', identifier: file.realpath });
    } catch {
        if (userCancelled) onCancel();
    } finally {
        dispose();
    }
};

const organizeDb = (entries: VdcDbEntry[]) => {
    const brands: OrganizedDb = {};
    entries.forEach(({ ID, Company, Model }) => {
        if (!(Company in brands)) brands[Company] = [];
        brands[Company].push({ ID, Company, Model });
    });

    const output: OrganizedDb = {};
    Object.keys(brands)
        .sort((a, b) => a.localeCompare(b))
        .forEach(company => {
            output[company] = brands[company].sort((a, b) => a.Model.localeCompare(b.Model));
        });
    return output;
};