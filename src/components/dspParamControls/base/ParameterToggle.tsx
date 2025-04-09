import { FC, useEffect, useState } from 'react';
import { Backend } from '../../../controllers/Backend';
import { DSPBooleanParameter } from '../../../types/dspTypes';
import { useDspSettingsContext } from '../../../hooks/contextHooks';
import { WaitToggle } from '../../waitable/WaitToggle';

export interface ParameterToggleProps {
    parameter: DSPBooleanParameter;
    invert?: boolean;
    customLabel?: string;
}

export const ParameterToggle: FC<ParameterToggleProps> = ({ parameter, invert, customLabel }) => {
    const { data: settings, setData: setSettings } = useDspSettingsContext();
    if (!settings) return null;

    const [value, setValue] = useState(settings[parameter]);

    useEffect(() => setValue(settings[parameter]), [settings[parameter]]);

    const onChange = (value: boolean) => {
        const val = invert ? !value : value;
        Backend.setDsp(parameter, val);
        setValue(val);
        setSettings?.({ ...settings, [parameter]: val });
    }

    return (
        <WaitToggle
            label={customLabel ?? (invert ? 'Disable' : 'Enable')}
            checked={invert ? !value : value}
            onChange={onChange}
            bottomSeparator='none'
        />
    );
};