
import { gamepadDialogClasses, quickAccessControlsClasses } from '@decky/ui';
import { FC } from "react";

export const QAMStyles: FC<{}> = ({ }) => {
    return <style>{`

        .main-page .profile-settings .${quickAccessControlsClasses.PanelSection} {
            margin-bottom: 0;
        }
        .qam-focusable-item .${gamepadDialogClasses.Field} {
            padding-top: 0;
        }
        .qam-focusable-item .${gamepadDialogClasses.FieldLabel} {
            display: none;
         }
    `}
    </style>;
}
