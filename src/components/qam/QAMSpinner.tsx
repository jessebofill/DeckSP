import { quickAccessMenuClasses } from '@decky/ui';
import { FadeSpinner } from '../generic/FadeSpinner';
import { FC, useLayoutEffect, useRef, useState } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';
import { QAMUnderTitleHider } from './QAMUnderTitleHider';

export const QAMSpinner: FC<{}> = ({ children }) => {
    const { ready } = usePluginContext();
    const [width, setWidth] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => { if (ref.current) setWidth(ref.current.offsetWidth) }, []);

    return (
        <>
            {!ready && <QAMUnderTitleHider />}
            <div style={{ position: 'absolute', width: '100%'}} ref={ref} />
            <div
                style={{
                    backdropFilter: 'blur(8px)',
                    zIndex: '100',
                    top: '50px',
                    bottom: '0',
                    position: 'fixed',
                    width: `calc(${width}px)`,
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
                    position: 'fixed',
                    width: `calc(${width}px)`
                }}
            >
                {children}
            </FadeSpinner>
        </>
    );
};