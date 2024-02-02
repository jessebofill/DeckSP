import { FC } from 'react';

export const QAMErrorWrapper: FC<{}> = ({ children }) => {
    return (
        <div style={{ padding: '15px', wordBreak: 'break-word' }}>
            {children}
        </div>
    );
};