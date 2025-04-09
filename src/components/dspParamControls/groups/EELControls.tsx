import { FieldProps, PanelSection, PanelSectionRow, quickAccessMenuClasses, showModal } from '@decky/ui';
import { FC, useCallback, useEffect } from 'react';
import { EffectInfo } from '../../other/EffectInfo';
import { ParameterPathSelector } from '../base/ParameterPathSelector';
import { ParameterToggle } from '../base/ParameterToggle';
import { useDspSettingsContext, useEELParametersContext } from '../../../hooks/contextHooks';
import { useError } from '../../../lib/utils';
import { QAMErrorWrapper } from '../../generic/QAMErrorWrapper';
import { FadeSpinner } from '../../generic/FadeSpinner';
import { ThrottledWaitSlider } from '../../waitable/WaitSlider';
import { EELParameter, EELParameterType } from '../../../types/types';
import { Backend } from '../../../controllers/Backend';
import { Log } from '../../../lib/log';
import { WaitDropdown } from '../../waitable/WaitDropdown';
import { WaitButton } from '../../waitable/WaitButton';
import { useSetEelDefaults } from '../../../hooks/useSetEelDefaults';
import { reaction } from 'mobx';
import { profileManager } from '../../../controllers/ProfileManager';
import { DestructiveModal } from '../../generic/DestructiveModal';
import { QAMHiglightable } from '../../qam/QAMHiglightable';

export const EELControls: FC<{}> = ({ }) => {
    return (
        <PanelSection title='EEL Effect Script'>
            <EffectInfo effect='soundstageWideness'> {/*!!! need to change this */}
                <PanelSectionRow>
                    <ParameterToggle parameter='liveprog_enable' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterPathSelector parameter='liveprog_file' startPath='/home/deck/.var/app/me.timschneeberger.jdsp4linux/config/jamesdsp/liveprog/' />
                </PanelSectionRow>
                <EELParameterSection />
            </EffectInfo>
        </PanelSection>
    );
};

const EELParameterSection: FC<{}> = ({ }) => {
    const { ready } = useEELParametersContext();
    const { data } = useDspSettingsContext();
    if (data?.liveprog_file === "") return <div style={{ marginTop: '10px' }}>No EEL script selected</div>
    const fadeTime = 250;
    return (
        <>
            {!ready && <div style={{ marginTop: '10px', padding: '0 16px', position: 'absolute', right: '0' }}>
                Loading user configurable script parameters...
            </div>}
            <FadeSpinner
                isLoading={!ready}
                showChildrenLoading={true}
                className={quickAccessMenuClasses.QuickAccessMenu}
                fadeTime={fadeTime}
                style={{
                    background: 'transparent',
                    zIndex: '101',
                    right: '0px',
                    position: 'absolute',
                    height: '-webkit-fill-available',
                    marginTop: '15px'
                }}
                spinnerSize='90px'
            >
                <EELParameterSectionInner />
            </FadeSpinner>
        </>
    )
}

const EELParameterSectionInner: FC<{}> = ({ }) => {
    const { data: parameters, setData: setParameters, error, ready } = useEELParametersContext();
    if (!ready) return;

    if (error) {
        return (
            <QAMErrorWrapper noColor={true} noSuggest={true}>
                {useError('Problem occured getting user configurable EEL parameters', error).message}
            </QAMErrorWrapper>
        );
    }

    if (!parameters) return;

    const onChange = useCallback((paramName: string, value: number) => {
        const index = parameters.findIndex(param => param.variable_name === paramName);
        const updatedParams = [...parameters];
        updatedParams[index].current_value = value;
        //todo make async and check error (it might mess up throttling)
        Log.log('slider changed', value)
        Backend.setEELParam(paramName, value);
        setParameters?.(updatedParams);
    }, [parameters, setParameters]);

    return (parameters.length === 0 ?
        <div style={{ marginTop: '10px' }}>Script has no user configurable parameters</div> :
        <>
            {parameters.map(param => {
                switch (param.type) {
                    case EELParameterType.LIST:
                        return <PanelSectionRow>
                            <EELParameterDropdown parameter={param as EELParameter<EELParameterType.LIST>} update={value => onChange(param.variable_name, value)} />
                        </PanelSectionRow>

                    case EELParameterType.SLIDER:
                        return <PanelSectionRow>
                            <EELParameterSlider parameter={param as EELParameter<EELParameterType.SLIDER>} update={value => onChange(param.variable_name, value)} />
                        </PanelSectionRow>

                    default:
                        return <div>Unexpected Parameter Type</div>
                }
            })}
            <SetEELDefaultsButton bottomSeparator='none' />
        </>
    )
}

interface EELParameterSliderProps {
    parameter: EELParameter<EELParameterType.SLIDER>;
    update: (value: number) => void;
    disable?: boolean;
}

export const EELParameterSlider: FC<EELParameterSliderProps> = ({ parameter, update, disable }) => {
    const { description, min, max, step, current_value: value } = parameter;

    return (
        <ThrottledWaitSlider
            disabled={disable}
            label={description}
            value={value}
            min={min}
            max={max}
            showValue={true}
            step={step}
            onChange={update}
            bottomSeparator='none'
        />
    );
};

interface EELParameterDropdownProps {
    parameter: EELParameter<EELParameterType.LIST>;
    update: (value: number) => void;
    disable?: boolean;
}

export const EELParameterDropdown: FC<EELParameterDropdownProps> = ({ parameter, update, disable }) => {
    const { description, options, current_value: value } = parameter;
    return (
        <WaitDropdown
            disabled={disable}
            label={description}
            rgOptions={options.map((opt, index) => ({ label: opt, data: index }))}
            selectedOption={value}
            onChange={opt => update(opt.data)}
            bottomSeparator='none'
        />
    );
};

interface SetEELDefaultsButtonProps {
    bottomSeparator?: FieldProps['bottomSeparator'];
}

const SetEELDefaultsButton: FC<SetEELDefaultsButtonProps> = ({ bottomSeparator }) => {
    const setDefaults = useSetEelDefaults();
    const { data } = useDspSettingsContext();
    const scriptName = data?.liveprog_file.split('/').at(-1) ?? '';
    return (
        <QAMHiglightable bottomSeparator={bottomSeparator} >
            <WaitButton onClick={() => showModal(<ConfirmSetDefaultModal onConfirm={setDefaults} scriptName={scriptName} />)}>
                Reset script parameters
            </WaitButton>
        </ QAMHiglightable>
    );
};

interface ConfirmSetDefaultModalProps {
    scriptName: string;
    onConfirm?: () => void;
    closeModal?: () => void;
}

const ConfirmSetDefaultModal: FC<ConfirmSetDefaultModalProps> = ({ scriptName, onConfirm, closeModal }) => {
    const profileName = profileManager.activeProfile?.name ?? '';
    useEffect(() => reaction(() => profileManager.activeProfileId, () => closeModal?.()), []);

    return (
        <DestructiveModal
            closeModal={closeModal}
            onOK={() => { onConfirm?.() }}
            strTitle={`Reset ${scriptName} parameters for ${profileName} profile`}
            strDescription={'Are you sure you want to reset the parameters for this script and profile to defaults?'}
        />
    );
};

