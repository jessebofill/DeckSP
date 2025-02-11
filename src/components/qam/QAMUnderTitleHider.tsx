import { FC } from 'react';
import { titleViewClasses } from '../../defines/cssClasses';

export const QAMUnderTitleHider: FC<{}> = () => {
    return (
        <style>{`
            .${titleViewClasses.belowTitle} {
                display: none;
            }
        `}</style>
    );
};