import { Field, quickAccessControlsClasses } from '@decky/ui';
import { FC17 } from 'react';

export interface QAMHiglightableProps {
    bottomSeparator?: 'standard' | 'thick' | 'none';
}

export const QAMHiglightable: FC17<QAMHiglightableProps> = ({ children, bottomSeparator }) => {
    return <div className={`qam-focusable-item ${quickAccessControlsClasses.PanelSectionRow}`}>
        <Field description={children} bottomSeparator={bottomSeparator} />
    </div>;
};