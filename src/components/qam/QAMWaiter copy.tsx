import { FC, useState } from 'react';
import { PluginContext } from '../../contexts/contexts';
import { quickAccessMenuClasses } from '@decky/ui';
import { FadeSpinner } from '../generic/FadeSpinner';

export const QAMWaiter: FC<{}> = ({ children }) => {
    const [ready, setReady] = useState(true);

    return (
        <PluginContext.Provider value={{ ready, setReady }}>
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