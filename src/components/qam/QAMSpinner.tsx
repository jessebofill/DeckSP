import { quickAccessMenuClasses } from 'decky-frontend-lib';
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
                ref={ref}
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