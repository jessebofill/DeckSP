import { SliderField, SliderFieldProps } from '@decky/ui';
import { ThrottledSlider } from '../generic/ThrottledSlider';
import { FC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const ThrottledWaitSlider: FC<SliderFieldProps> = (props) => {
    const { ready } = usePluginContext();

    return <ThrottledSlider {...props} disabled={!ready || props.disabled} />;
};

export const WaitSlider: FC<SliderFieldProps> = (props) => {
    const { ready } = usePluginContext();

    return <SliderField {...props} disabled={!ready || props.disabled} />;
};