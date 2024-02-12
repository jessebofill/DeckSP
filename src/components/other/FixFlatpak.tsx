import { DialogButton, Field, PanelSection, PanelSectionRow } from 'decky-frontend-lib';
import { VFC } from 'react';
import { Backend } from '../../controllers/Backend';
import { useError } from '../../lib/utils';
import { useFlatpakFix } from '../../hooks/contextHooks';
import { FixFlatpakDescriptions } from './FlatpakFixContextProvider';
import { FlatpakFixState } from '../../types/types';

export const FixFlatpak: VFC<{}> = ({ }) => {
    const { state, setState, description, setDescription } = useFlatpakFix();
    if (!setState || !setDescription ) return null;

    return (
        <PanelSection title='Fix Flatpak'>
            <PanelSectionRow>
                <Field description={description} childrenLayout='below'>
                    <DialogButton
                        style={{ height: '40px', padding: '5px 14px' }}
                        disabled={state !== FlatpakFixState.default}
                        onClick={async () => {
                            try {
                                setState(FlatpakFixState.busy);
                                await Backend.flatpakRepair();
                                setState(FlatpakFixState.done)
                                setDescription(FixFlatpakDescriptions.done)
                            } catch (err) {
                                const errorMsg = `There a was a problem when trying to repair flatpak - \n ${(err as Error).message ?? ''}`;
                                useError(errorMsg);
                                setState(FlatpakFixState.error)
                                setDescription(errorMsg);
                            }
                        }}
                    >
                        {state !== FlatpakFixState.busy ? state === FlatpakFixState.default ? 'Attempt Fix' : 'Done' :
                            <div style={{ height: '100%' }}>
                                <img alt="Loading..." src="/images/steam_spinner.png" style={{ height: '100%' }} />
                            </div>
                        }
                    </DialogButton>
                </Field>
            </PanelSectionRow>
        </PanelSection >
    );
};