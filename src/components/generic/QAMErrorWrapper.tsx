import { FC17 } from 'react';

export const QAMErrorWrapper: FC17<{}> = ({ children }) => {
    return (
        <div style={{ padding: '15px', wordBreak: 'break-word' }}>
            {children}
        </div>
    );
};