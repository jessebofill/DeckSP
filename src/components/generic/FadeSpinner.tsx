import { CSSProperties, FC17, useLayoutEffect, useState } from 'react'

export interface FadeSpinnerProps {
    isLoading: boolean;
    className?: string;
    style?: CSSProperties;
    showChildrenLoading?: boolean;
    fadeTime?: number;
}

export const FadeSpinner: FC17<FadeSpinnerProps> = ({ isLoading, className, style, showChildrenLoading, fadeTime, children }) => {
        const [fadeDone, setFadeDone] = useState(false);
        const fade = fadeTime ?? 250;
        useLayoutEffect(() => {
            if (!isLoading) setTimeout(() => setFadeDone(true), fadeTime);
            else setFadeDone(false);
        }, [isLoading]);
    return (
        <>
            <div
                className={className}
                style={Object.assign({
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: `opacity ease-out ${fade}ms`,
                },
                style ?? {},
                isLoading ? {} : { opacity: 0 },
                !fadeDone ? {} : { zIndex: '-100' }
                )}>
                <img alt="Loading..." src="/images/steam_spinner.png" style={{ width: '50%' }} />
            </div>
            {(!isLoading || showChildrenLoading) && children}
        </>
    );
};