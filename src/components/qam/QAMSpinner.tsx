import { quickAccessMenuClasses } from 'decky-frontend-lib';
import { FadeSpinner } from '../generic/FadeSpinner';
import { FC } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';
import { QAMUnderTitleHider } from './QAMUnderTitleHider';

export const QAMSpinner: FC<{}> = ({ children }) => {
    const { ready } = usePluginContext();

    return (
        <>
            {!ready && <QAMUnderTitleHider />}
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
        </>
    );
};