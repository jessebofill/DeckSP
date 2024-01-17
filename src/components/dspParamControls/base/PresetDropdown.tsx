import { ReactElement, useMemo } from 'react';
import { DSPEQParameters, DSPRangeParameter, PresetSectionType } from '../../../types/dspTypes';
import { DropdownItem, SingleDropdownOption } from 'decky-frontend-lib';
import { reverseLookupSectionPreset } from '../../../lib/utils';
import { useDspSettings } from '../../../hooks/contextHooks';
import { reverbPresetTable } from '../../../defines/reverbPresetTable';
import { Backend } from '../../../controllers/Backend';
import { useEQData } from '../groups/EQControls';
import { eqPresetTable } from '../../../defines/eqPresetTable';

export interface PresetDropdownProps<Type extends PresetSectionType> {
    type: Type;
}

export function PresetDropdown<PresetType extends PresetSectionType>({ type }: PresetDropdownProps<PresetType>): ReactElement {

    let presetTable: typeof eqPresetTable | typeof reverbPresetTable;
    let onSelect: (option: SingleDropdownOption) => void;
    let selected: string | undefined;

    switch (type) {
        case 'eq':
            const { data: eqSettings, setAll } = useEQData();
            if (!eqSettings || !setAll) return <></>;
            presetTable = eqPresetTable;
            selected = reverseLookupSectionPreset(presetTable, eqSettings);

            onSelect = (option: SingleDropdownOption) => {
                setAll(Object.fromEntries((presetTable.presets[option.data] as number[]).map((value, index) => [presetTable.paramMap[index], value])) as DSPEQParameters);
            };
            break;

        case 'reverb':
            const { data: settings, setData: setSettings } = useDspSettings();
            if (!settings || !setSettings) return <></>;

            presetTable = reverbPresetTable;
            selected = reverseLookupSectionPreset(presetTable, settings);

            onSelect = (option: SingleDropdownOption) => {
                const newSettings = { ...settings };
                (presetTable.presets[option.data] as number[]).forEach((value, index) => {
                    const parameter = presetTable.paramMap[index] as DSPRangeParameter;
                    Backend.setDsp(parameter, value);
                    newSettings[parameter] = value;
                });
                setSettings(newSettings);
            }
            break;

        default:
            throw new Error(`Unexpected preset parameter type: ${type}`);

    }
    const options = useMemo(() => Object.keys(presetTable.presets).map(presetKey => {
        return {
            data: presetKey,
            label: presetKey
        }
    }), []);

    return (
        <DropdownItem
            label='Preset'
            rgOptions={options}
            selectedOption={selected}
            onChange={onSelect}
            strDefaultLabel='Select...'
            bottomSeparator='none'
        />
    );
};