import { ReactElement, useMemo } from 'react';
import { DSPEQParameters, DSPRangeParameter, PresetSectionType } from '../../../types/dspTypes';
import { SingleDropdownOption } from '@decky/ui';
import { reverseLookupSectionPreset, useError } from '../../../lib/utils';
import { useDspSettingsContext, usePluginContext } from '../../../hooks/contextHooks';
import { reverbPresetTable } from '../../../defines/reverbPresetTable';
import { Backend } from '../../../controllers/Backend';
import { useEQDataContext } from '../../../hooks/contextHooks';
import { eqPresetTable } from '../../../defines/eqPresetTable';
import { WaitDropdown } from '../../waitable/WaitDropdown';

export interface PresetDropdownProps<Type extends PresetSectionType> {
    type: Type;
}

export function PresetDropdown<PresetType extends PresetSectionType>({ type }: PresetDropdownProps<PresetType>): ReactElement | null {
    const { setReady } = usePluginContext();
    if (!setReady) return null;

    let presetTable: typeof eqPresetTable | typeof reverbPresetTable;
    let onSelect: (option: SingleDropdownOption) => void;
    let selected: string | undefined;

    switch (type) {
        case 'eq':
            const { data: eqSettings, setAll } = useEQDataContext();
            if (!eqSettings || !setAll) return null;
            presetTable = eqPresetTable;
            selected = reverseLookupSectionPreset(eqPresetTable, eqSettings);

            onSelect = (option: SingleDropdownOption) => {
                setAll(Object.fromEntries((eqPresetTable.presets[option.data as keyof typeof eqPresetTable.presets]).map((value, index) => [eqPresetTable.paramMap[index], value])) as DSPEQParameters);
            };
            break;

        case 'reverb':
            const { data: settings, setData: setSettings, setError } = useDspSettingsContext();
            if (!settings || !setSettings || !setError) return null;
            presetTable = reverbPresetTable;
            selected = reverseLookupSectionPreset(reverbPresetTable, settings);
            onSelect = (option: SingleDropdownOption) => {
                const sendParams: [DSPRangeParameter, number][] = [];
                const newSettings = { ...settings };
                setReady(false);
                (reverbPresetTable.presets[option.data as keyof typeof reverbPresetTable.presets]).forEach((value, index) => {
                    const parameter = reverbPresetTable.paramMap[index] as DSPRangeParameter;
                    sendParams.push([parameter, value]);
                    newSettings[parameter] = value;
                });

                setSettings(newSettings);
                Backend.setMultipleDsp(...sendParams).then(() => setReady(true)).catch(e => {
                    setError(useError('Problem applying reverb preset', e));
                    setReady(true);
                })
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
        <WaitDropdown
            label='Preset'
            rgOptions={options}
            selectedOption={selected}
            onChange={onSelect}
            strDefaultLabel='Select...'
            bottomSeparator='none'
        />
    );
};