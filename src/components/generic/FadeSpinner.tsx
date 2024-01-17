import { CSSProperties, FC } from 'react'

export interface FadeSpinnerProps {
    isLoading: boolean;
    className?: string;
    style?: CSSProperties;
}

export const FadeSpinner: FC<FadeSpinnerProps> = ({ isLoading, className, style, children }) => {
    return (
        <>
            <div
                className={className}
                style={Object.assign({
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'opacity ease-out 250ms',
                },
                    isLoading ? {} : { opacity: 0 },
                    style ?? {}
                )}>
                <img alt="Loading..." src="/images/steam_spinner.png" style={{ width: '50%' }} />
            </div>
            {!isLoading && children}
        </>
    );
};