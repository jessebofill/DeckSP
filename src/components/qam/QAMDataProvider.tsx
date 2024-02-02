import { PluginContext } from '../../contexts/contexts';
import { AsyncDataProvider } from '../generic/AsyncDataProvider';
import { handleWaitSettings } from '../../controllers/asyncDataHandlers';
import { QAMSpinner } from './QAMSpinner';
import { FC } from 'react';
import { PluginDataProvider } from '../other/PluginDataProvider';

export const QAMDataProvider: FC<{}> = ({ children }) => {
    return (
        <AsyncDataProvider Context={PluginContext} handler={handleWaitSettings}>
            <QAMSpinner>
                <PluginDataProvider>
                    {children}
                </PluginDataProvider>
            </QAMSpinner>
        </AsyncDataProvider>
    );
};