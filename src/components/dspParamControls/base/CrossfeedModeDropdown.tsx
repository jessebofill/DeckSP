import { SingleDropdownOption } from '@decky/ui';
import { FC, useMemo } from 'react';
import { dspParamDefines } from '../../../defines/dspParameterDefines';
import { useDspSettings } from '../../../hooks/contextHooks';
import { Backend } from '../../../controllers/Backend';
import { WaitDropdown } from '../../waitable/WaitDropdown';

export const CrossfeedModeDropdown: FC<{}> = ({ }) => {
    const { data: settings, setData: setSettings } = useDspSettings();
    if (!settings || !setSettings) return null;

    const options = useMemo(() => Object.entries(dspParamDefines.crossfeed_mode.map).map(([label, id]) => {
        return {
            data: id,
            label: label
        }
    }), []);

    const onSelect = (option: SingleDropdownOption) => {
        Backend.setDsp('crossfeed_mode', option.data);
        const newSettings = { ...settings, ['crossfeed_mode']: option.data }
        switch (option.data) {
            case 0:
                Backend.setDsp('crossfeed_bs2b_fcut', 700);
                Backend.setDsp('crossfeed_bs2b_feed', 6);
                newSettings.crossfeed_bs2b_fcut = 700;
                newSettings.crossfeed_bs2b_feed = 6;
                break;
            case 1:
                Backend.setDsp('crossfeed_bs2b_fcut', 650);
                Backend.setDsp('crossfeed_bs2b_feed', 9.5);
                newSettings.crossfeed_bs2b_fcut = 650;
                newSettings.crossfeed_bs2b_feed = 9.5;
                break;
        }
        setSettings(newSettings);
    };

    return (
        <WaitDropdown
            label={dspParamDefines.crossfeed_mode.label}
            rgOptions={options}
            selectedOption={settings.crossfeed_mode}
            onChange={onSelect}
            bottomSeparator='none'
        />
    );
};