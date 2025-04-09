import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC17, FC, useEffect, useState } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';
import { DSPCompanderParameters } from '../../../types/dspTypes';
import { Backend } from '../../../controllers/Backend';
import { useDspSettingsContext } from '../../../hooks/contextHooks';
import { CompanderParameterSlider } from '../base/ParameterSlider';
import { CompanderDataContext } from '../../../contexts/contexts';
import { EffectInfo } from '../../other/EffectInfo';

export const CompanderDataProvider: FC17<{}> = ({ children }) => {
    const { data: settings, setData: setSettings } = useDspSettingsContext();
    if (!settings || !setSettings) return null;

    const [values, setValues] = useState(settings['compander_response']);

    useEffect(() => setValues(settings['compander_response']), [settings['compander_response']]);

    const setParameter = (parameter: keyof DSPCompanderParameters, value: number) => {
        const newValues = { ...values, [parameter]: value };
        Backend.setDsp('compander_response', newValues);
        setValues(newValues);
        setSettings({ ...settings, compander_response: newValues });
    }

    return (
        <CompanderDataContext.Provider value={{ data: values, setParameter }}>
            {children}
        </CompanderDataContext.Provider>
    );
};


export const CompanderControls: FC<{}> = ({ }) => {

    return (
        <CompanderDataProvider>
            <PanelSection title='Dynamic Range Compander'>
                <EffectInfo effect='dynamicRangeCompander'>
                    <PanelSectionRow>
                        <ParameterToggle parameter='compander_enable' />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <ParameterSlider parameter='compander_timeconstant' />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <ParameterSlider parameter='compander_granularity' />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <CompanderParameterSlider parameter='95' />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <CompanderParameterSlider parameter='200' />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <CompanderParameterSlider parameter='400' />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <CompanderParameterSlider parameter='800' />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <CompanderParameterSlider parameter='1600' />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <CompanderParameterSlider parameter='3400' />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <CompanderParameterSlider parameter='7500' />
                    </PanelSectionRow>
                </EffectInfo>
            </PanelSection>
        </CompanderDataProvider>
    );
};