import { FC } from 'react';
import { DSPPathParameter } from '../../../types/dspTypes';
import { FileSelectionType, openFilePicker } from '@decky/api';
import { CustomButton, CustomButtonProps } from '../../generic/CustomButton';
import { Field, FieldProps } from '@decky/ui';
import { dspParamDefines } from '../../../defines/dspParameterDefines';
import { Backend } from '../../../controllers/Backend';
import { useDspSettingsContext } from '../../../hooks/contextHooks';

export interface ParameterPathSelectorProps extends Pick<CustomButtonProps, 'transparent' | 'audioSFX' | 'noAudio' | 'containerClassName'> {
    parameter: DSPPathParameter;
    labelCenter?: boolean;
    disabled?: boolean;
    focusable?: boolean;
    bottomSeparator?: FieldProps['bottomSeparator'];
    description?: string;
}

export const ParameterPathSelector: FC<ParameterPathSelectorProps> = ({ parameter, labelCenter, disabled, focusable, bottomSeparator, description }) => {
    const { data: settings, setData: setSettings } = useDspSettingsContext();
    if (!settings) return null;

    const path = settings[parameter]
    const { label, exts, start } = dspParamDefines[parameter];
    const file = path.split('/').at(-1)
    const onChange = (value: string) => {
        Backend.setDsp(parameter, value);
        setSettings?.({ ...settings, [parameter]: value });
    };

    const selectFile = async () => {
        const file = await openFilePicker(FileSelectionType.FILE, start, true, true, undefined, [...exts], false, false);
        onChange(file.realpath);
    };

    return (
        <Field label={label} childrenLayout='below' bottomSeparator={bottomSeparator ?? 'none'} description={description} >
            <CustomButton
                style={{ padding: '10px 16px' }}
                noAudio={true}
                onClick={selectFile}
                focusable={focusable}
                disabled={disabled}
            >
                <div style={{ display: 'flex', overflow: 'hidden' }}>
                    <div style={{ overflow: 'hidden', flex: 'auto' }}>
                        <div style={{ textAlign: labelCenter ? 'center' : 'left', minHeight: '20px' }}>
                            {!!file?.trim() ? file : 'Select...'}
                        </div>
                    </div>
                    <div style={{ display: 'flex', marginLeft: '1ch', flex: 'none' }}>
                        <svg style={{ height: '1em', margin: 'auto' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none"><path d="M17.98 26.54L3.20996 11.77H32.75L17.98 26.54Z" fill="currentColor"></path></svg>
                    </div>
                </div>
            </CustomButton>
        </Field>
    );
};