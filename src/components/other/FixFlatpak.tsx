import { DialogButton, Field, PanelSection, PanelSectionRow } from 'decky-frontend-lib';
import { VFC } from 'react';

const description = `Try this if you get the error that jdsp is not installed.`

export const FixFlatpak: VFC<{}> = ({ }) => {
    return (
        <PanelSection title='Attempt Flatpak Fix'>
            <PanelSectionRow>
                <Field description={description} childrenLayout='below'                >
                    <DialogButton>
                        Fix
                    </DialogButton>
                </Field>
            </PanelSectionRow>
        </PanelSection>
    );
};