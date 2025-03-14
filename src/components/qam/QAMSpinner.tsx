import { quickAccessMenuClasses } from '@decky/ui';
import { FadeSpinner } from '../generic/FadeSpinner';
import { FC17, useLayoutEffect, useRef, useState } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';
import { QAMUnderTitleHider } from './QAMUnderTitleHider';

export const QAMSpinner: FC17<{}> = ({ children }) => {
    const { ready } = usePluginContext();
    const [width, setWidth] = useState(0);
    const [fadeDone, setFadeDone] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const fadeTime = 250;
    useLayoutEffect(() => { if (ref.current) setWidth(ref.current.offsetWidth) }, []);
    useLayoutEffect(() => {
        if (ready) setTimeout(() => setFadeDone(true), fadeTime);
        else setFadeDone(false);
    }, [ready]);

    return (
        <>
            {!ready && <QAMUnderTitleHider />}
            <div style={{ position: 'absolute', width: '100%' }} ref={ref} />
            <div
                style={{
                    backdropFilter: 'blur(8px)',
                    zIndex: ready && fadeDone ? '-100' : '100',
                    top: '50px',
                    bottom: '0',
                    position: 'fixed',
                    width: `calc(${width}px)`,
                    transition: `opacity ease-out ${fadeTime}ms`,
                    opacity: ready ? 0 : undefined
                }}
            />
            <FadeSpinner
                isLoading={!ready}
                showChildrenLoading={true}
                className={quickAccessMenuClasses.QuickAccessMenu}
                fadeTime={fadeTime}
                style={{
                    background: 'transparent',
                    zIndex: '101',
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