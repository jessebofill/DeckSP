import { VFC, useEffect, useState } from 'react';
import { Backend } from '../../../controllers/Backend';
import { DSPBooleanParameter } from '../../../types/dspTypes';
import { useDspSettings } from '../../../hooks/contextHooks';
import { WaitToggle } from '../../waitable/WaitToggle';

export interface ParameterToggleProps {
    parameter: DSPBooleanParameter;
    invert?: boolean;
    customLabel?: string;
}

export const ParameterToggle: VFC<ParameterToggleProps> = ({ parameter, invert, customLabel }) => {
    const { data: settings, setData: setSettings } = useDspSettings();
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