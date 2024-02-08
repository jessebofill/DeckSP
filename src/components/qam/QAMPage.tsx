import { FC } from 'react';
import { useDspSettings, usePluginSettings } from '../../hooks/contextHooks';
import { QAMErrorWrapper } from '../generic/QAMErrorWrapper';


export interface QAMPageProps {
    dataProvider: 'plugin' | 'dsp';
}
export const QAMPage: FC<QAMPageProps> = ({ children, dataProvider }) => {
    const useData = dataProvider === 'plugin' ? usePluginSettings : useDspSettings;
    const { error } = useData();
    if (error) return <QAMErrorWrapper>{`Error: ${error.message}`}</QAMErrorWrapper>;

    return (
        <>
            {children}
        </>
    );
};
