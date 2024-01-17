import { PanelSection, PanelSectionRow } from 'decky-frontend-lib';
import { FC, VFC, createContext, useContext, useState } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';
import { dspParamDefines } from '../../../defines/dspParameterDefines';
import { DSPCompanderParameters } from '../../../types/dspTypes';
import { Backend } from '../../../controllers/Backend';
import { useDspSettings } from '../../../hooks/contextHooks';
import { ThrottledSlider } from '../base/ThrottledSlider';

const CompanderDataContext = createContext<{ data?: DSPCompanderParameters, setParameter?: (parameter: keyof DSPCompanderParameters, value: number) => void }>({});

export const CompanderDataProvider: FC<{}> = ({ children }) => {
    const { data: settings, setData: setSettings } = useDspSettings();
    if (!settings || !setSettings) return <></>;

    const [values, setValues] = useState(settings['compander_response']);

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


export const CompanderControls: VFC<{}> = ({ }) => {

    return (
        <CompanderDataProvider>
            <PanelSection title='Dynamic Range Compander'>
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
            </PanelSection>
        </CompanderDataProvider>
    );
};

interface CompanderParameterSliderProps {
    parameter: keyof DSPCompanderParameters;
}

export const CompanderParameterSlider: VFC<CompanderParameterSliderProps> = ({ parameter }) => {
    const { data: values, setParameter } = useContext(CompanderDataContext);
    if (!values || !setParameter) return <></>;

    const [min, max] = dspParamDefines['compander_response'][parameter].limits;

    const onChange = (value: number) => {
        setParameter(parameter, value);
    };

    return (
        <ThrottledSlider
            label={dspParamDefines['compander_response'][parameter].label}
            value={values[parameter]}
            min={min}
            max={max}
            showValue={true}
            valueSuffix={' ' + dspParamDefines['compander_response'][parameter].units}
            step={dspParamDefines['compander_response'][parameter].step}
            onChange={onChange}
            bottomSeparator='none'
        />
    );
};