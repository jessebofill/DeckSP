import { PluginContext } from '../../contexts/contexts';
import { AsyncDataProvider } from './AsyncDataProvider';
import { handleWaitSettings } from '../../controllers/asyncDataHandlers';
import { QAMSpinner } from '../qam/QAMSpinner';
import { FC17 } from 'react';
import { PluginDataProvider } from './PluginDataProvider';
import { EELDataProvider } from './EELDataProvider';
import { StaticDataProvider } from './StaticDataProvider';

export const QAMDataProvider: FC17<{}> = ({ children }) => {
    return (
        <AsyncDataProvider Context={PluginContext} handler={handleWaitSettings}>
            <QAMSpinner>
                <PluginDataProvider>
                    <StaticDataProvider>
                        <EELDataProvider>
                            {children}
                        </EELDataProvider>
                    </StaticDataProvider>
                </PluginDataProvider>
            </QAMSpinner>
        </AsyncDataProvider>
    );
};