import { PluginContext } from '../../contexts/contexts';
import { AsyncDataProvider } from './AsyncDataProvider';
import { handleWaitSettings } from '../../controllers/asyncDataHandlers';
import { QAMSpinner } from '../qam/QAMSpinner';
import { FC17 } from 'react';
import { PluginDataProvider } from './PluginDataProvider';
import { EELDataProvider } from './EELDataProvider';

export const QAMDataProvider: FC17<{}> = ({ children }) => {
    return (
        <AsyncDataProvider Context={PluginContext} handler={handleWaitSettings}>
            <QAMSpinner>
                <PluginDataProvider>
                    <EELDataProvider>
                        {children}
                    </EELDataProvider>
                </PluginDataProvider>
            </QAMSpinner>
        </AsyncDataProvider>
    );
};