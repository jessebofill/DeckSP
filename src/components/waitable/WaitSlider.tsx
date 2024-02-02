import { SliderField, SliderFieldProps } from 'decky-frontend-lib';
import { ThrottledSlider } from '../generic/ThrottledSlider';
import { VFC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';

export const ThrottledWaitSlider: VFC<SliderFieldProps> = (props) => {
    const { ready } = usePluginContext();

    return <ThrottledSlider {...props} disabled={!ready || props.disabled} />;
};

export const WaitSlider: VFC<SliderFieldProps> = (props) => {
    const { ready } = usePluginContext();

    return <SliderField {...props} disabled={!ready || props.disabled} />;
};