import { SliderField, SliderFieldProps } from '@decky/ui'
import { FC, useEffect, useMemo, useState } from 'react'
import { getDebounced } from '../../lib/utils';

export const ThrottledSlider: FC<SliderFieldProps> = (props) => {
    const [value, setValue] = useState(props.value);

    useEffect(() => setValue(props.value), [props.value]);

    const throttledFn = !props.onChange ? undefined : useMemo(() => getDebounced(props.onChange!, 200), [props.onChange]);
    const onChange = (value: number) => {
        setValue(value);
        throttledFn?.(value);
    };

    return <SliderField {...props} value={value} onChange={onChange} />;
};

