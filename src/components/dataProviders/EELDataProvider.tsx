import { FC17, useEffect, useState } from 'react';
import { EELParametersContext } from '../../contexts/contexts';
import { EELParameter, EELParameterType } from '../../types/types';
import { Backend } from '../../controllers/Backend';
import { useDspSettings } from '../../hooks/contextHooks';
import { Log } from '../../lib/log';
import { profileManager } from '../../controllers/ProfileManager';

export const EELDataProvider: FC17<{}> = ({ children }) => {
    const [data, setData] = useState<EELParameter<EELParameterType>[]>();
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<Error>();

    const { data: settings } = useDspSettings();
    Log.log('rendering eel prov')

    useEffect(() => {
        (async () => {
            Log.log('call eel prov use eff')
            if (settings) {
                setReady(false);
                const res = await Backend.getEELParams(settings.liveprog_file, profileManager.activeProfileId).catch(e => e instanceof Error ? e : new Error('Caught exception in EEL data handler'));
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
    }, [settings?.liveprog_file, profileManager.activeProfileId]);

    return (
        <EELParametersContext.Provider value={{ ready, data, error }}>
            {children}
        </EELParametersContext.Provider>
    );
};