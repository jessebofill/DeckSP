import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { DataProviderSetData } from '../../contexts/contexts';
import { PluginContext } from '../../contexts/contexts';
import { quickAccessMenuClasses } from 'decky-frontend-lib';
import { FadeSpinner } from '../generic/FadeSpinner';
import { PluginData } from '../../types/types';

export interface QAMWaiterProps {
    handler: (setData: DataProviderSetData<PluginData>, setReady: Dispatch<SetStateAction<boolean>>) => Promise<any>;
    children: ReactNode;
};

export function QAMWaiter({ children, handler }: QAMWaiterProps) {
    const [ready, setReady] = useState(false);
    const [data, setData] = useState<PluginData>();

    useEffect(() => { handler(setData, setReady) }, []);

    return (
        <PluginContext.Provider value={{ ready, setReady, data, setData }}>
            <div style={{ position: 'sticky' }}>
                <div
                    style={{
                        backdropFilter: 'blur(8px)',
                        position: 'absolute',
                        zIndex: '100',
                        height: '100%',
                        width: '100%',
                        transition: 'opacity ease-out 250ms',
                        opacity: ready ? 0 : undefined
                    }}
                />
                <FadeSpinner
                    isLoading={!ready}
                    showChildrenLoading={true}
                    className={quickAccessMenuClasses.QuickAccessMenu}
                    style={{
                        background: 'transparent',
                        zIndex: '100',
                        top: '50px',
                        height: '400px',
                        position: 'sticky',
                    }}
                >
                    <div style={{ position: 'relative', top: '-400px' }}>
                        {children}
                    </div>
                </FadeSpinner>
            </div>
        </PluginContext.Provider>
    );
};