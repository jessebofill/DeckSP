import { FC17, useEffect, useState } from 'react';
import { EELDataContext, EELTriggerContext } from '../../contexts/contexts';
import { EELData } from '../../types/types';
import { Backend } from '../../controllers/Backend';
import { useDspSettingsContext } from '../../hooks/contextHooks';
import { profileManager } from '../../controllers/ProfileManager';

export const EELDataProvider: FC17<{}> = ({ children }) => {
    const [data, setData] = useState<EELData>();
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<Error>();
    const [trigger, setTrigger] = useState<{}>();
    const { data: settings } = useDspSettingsContext();

    useEffect(() => {
        (async () => {
            if (settings) {
                setReady(false);
                const res = await Backend.getEELParamsAndDesc(settings.liveprog_file, profileManager.activeProfileId).catch(e => e instanceof Error ? e : new Error('Caught exception in EEL data handler'));
                if (res instanceof Error) {
                    setError(res);
                    setData(undefined);
                } else {
                    setData(res);
                    setError(undefined);
                }
                setReady(true);
            }
        })();
    }, [settings?.liveprog_file, profileManager.activeProfileId, trigger]);

    return (
        <EELDataContext.Provider value={{ ready, data, error }}>
            <EELTriggerContext.Provider value={{ data: trigger, setData: setTrigger }}>
                {children}
            </EELTriggerContext.Provider>
        </EELDataContext.Provider>
    );
};