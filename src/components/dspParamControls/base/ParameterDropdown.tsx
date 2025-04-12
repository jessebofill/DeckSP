import { SingleDropdownOption } from '@decky/ui';
import { FC, useCallback, useMemo } from 'react';
import { dspParamDefines } from '../../../defines/dspParameterDefines';
import { useDspSettingsContext } from '../../../hooks/contextHooks';
import { Backend } from '../../../controllers/Backend';
import { WaitDropdown } from '../../waitable/WaitDropdown';
import { DSPMappedParameter } from '../../../types/dspTypes';

export interface ParameterDropdownProps {
    parameter: DSPMappedParameter;
    disable?: boolean;
}

export const ParameterDropdown: FC<ParameterDropdownProps> = ({ parameter, disable }) => {
    const { data: settings, setData: setSettings } = useDspSettingsContext();
    if (!settings || !setSettings) return null;

    const options = useMemo(() => Object.entries(dspParamDefines[parameter].map).map(([label, value]) => {
        return {
            data: value,
            label: label
        }
    }), []);

    const onSelect = useCallback((option: SingleDropdownOption) => {
        Backend.setDsp(parameter, option.data);
        setSettings({ ...settings, [parameter]: option.data });
    }, [settings]);

    return (
        <WaitDropdown
            disabled={disable}
            label={dspParamDefines[parameter].label}
            rgOptions={options}
            selectedOption={settings[parameter]}
            onChange={onSelect}
            bottomSeparator='none'
        />
    );
};