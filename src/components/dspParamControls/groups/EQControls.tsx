import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC17, VFC, useEffect, useState } from 'react';
import { ParameterToggle } from '../base/ParameterToggle';
import { Backend } from '../../../controllers/Backend';
import { useDspSettings } from '../../../hooks/contextHooks';
import { DSPEQParameters } from '../../../types/dspTypes';
import { PresetDropdown } from '../base/PresetDropdown';
import { EQParameterSlider } from '../base/ParameterSlider';
import { EQDataContext } from '../../../contexts/contexts';

export const EQDataProvider: FC17<{}> = ({ children }) => {
    const { data: settings, setData: setSettings } = useDspSettings();
    if (!settings || !setSettings) return null;

    const [values, setValues] = useState(settings['tone_eq']);

    useEffect(() => setValues(settings['tone_eq']), [settings['tone_eq']]);

    const setParameter = (parameter: keyof DSPEQParameters, value: number) => {
        const newValues = { ...values, [parameter]: value };
        Backend.setDsp('tone_eq', newValues);
        setValues(newValues);
        setSettings({ ...settings, tone_eq: newValues });
    }
    const setAll = (eqSettings: DSPEQParameters) => {
        Backend.setDsp('tone_eq', eqSettings);
        setValues(eqSettings);
        setSettings({ ...settings, tone_eq: eqSettings });
    }

    return (
        <EQDataContext.Provider value={{ data: values, setParameter, setAll }}>
            {children}
        </EQDataContext.Provider>
    );
}

export const EQControls: VFC<{}> = ({ }) => {

    return (
        <EQDataProvider>
            <PanelSection title='Equalizer'>
                <PanelSectionRow>
                    <ParameterToggle parameter='tone_enable' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <PresetDropdown type='eq' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='25' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='40' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='63' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='100' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='160' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='250' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='400' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='630' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='1000' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='1600' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='2500' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='4000' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='6300' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='10000' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='16000' />
                </PanelSectionRow>
            </PanelSection>
        </EQDataProvider>
    );
}