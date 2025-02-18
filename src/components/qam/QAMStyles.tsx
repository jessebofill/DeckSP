
import { gamepadDialogClasses } from '@decky/ui';
import { FC } from "react";

export const QAMStyles: FC<{}> = ({ }) => {
    return <style>{`
        .qam-focusable-item .${gamepadDialogClasses.Field} {
            padding-top: 0;
        }
        .qam-focusable-item .${gamepadDialogClasses.FieldLabel} {
            display: none;
         }
    `}
    </style>;
}
