import { FC } from 'react';
import { useDspSettings, usePluginState } from '../../hooks/contextHooks';
import { QAMErrorWrapper } from '../generic/QAMErrorWrapper';


export interface QAMPageProps {
    dataProvider: 'plugin' | 'dsp';
}
export const QAMPage: FC<QAMPageProps> = ({ children, dataProvider }) => {
    const useData = dataProvider === 'plugin' ? usePluginState : useDspSettings;
    const { error } = useData();

    if (error) return <QAMErrorWrapper>{`Error: ${error.message}`}</QAMErrorWrapper>;
    
    return (
        <>
            {children}
        </>
    );
};
