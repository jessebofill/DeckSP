import { FC17 } from 'react';
import { useDspSettings, usePluginState } from '../../../hooks/contextHooks';
import { QAMErrorWrapper } from '../../generic/QAMErrorWrapper';
import { Focusable } from '@decky/ui';


export interface QAMPageProps {
    dataProvider: 'plugin' | 'dsp';
    className?: string;
}
export const QAMPage: FC17<QAMPageProps> = ({ children, dataProvider, className }) => {
    const useData = dataProvider === 'plugin' ? usePluginState : useDspSettings;
    const { error } = useData();

    if (error) return <QAMErrorWrapper>{`Error: ${error.message}`}</QAMErrorWrapper>;
    
    return (
        <Focusable className={className}>
            {children}
        </Focusable>
    );
};
