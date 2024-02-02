import { VFC } from 'react';
import { titleViewClasses } from '../../defines/cssClasses';

export const QAMUnderTitleHider: VFC<{}> = () => {
    return (
        <style>{`
            .${titleViewClasses.belowTitle} {
                display: none;
            }
        `}</style>
    );
};