import { Field } from '@decky/ui';
import { FC17 } from 'react';

interface QAMPlainFieldProps {
    bottomSeparator?: 'standard' | 'thick' | 'none';
}

export const QAMPlainField: FC17<QAMPlainFieldProps> = ({ children, bottomSeparator }) => {
    return <div className='qam-focusable-item '>
        <Field description={children} bottomSeparator={bottomSeparator} />
    </div>;
};