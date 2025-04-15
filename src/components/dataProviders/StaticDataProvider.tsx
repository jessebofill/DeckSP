import { FC17, useState, useEffect } from 'react';
import { StaticDataContext } from '../../contexts/contexts';
import { StaticFromBackend } from '../../types/types';
import { PluginManager } from '../../controllers/PluginManager';
import { usePluginStateContext } from '../../hooks/contextHooks';

export const StaticDataProvider: FC17<{}> = ({ children }) => {
    const [data, setData] = useState<Partial<StaticFromBackend>>({});
    const { setError } = usePluginStateContext();

    useEffect(() => {
        (async () => {
            PluginManager.waitForPromiseCreation('static');
            const staticData = await PluginManager.promises.static!;
            if (staticData instanceof Error) setError?.(staticData);
            else setData(staticData);
        })()
    }, []);

    return (
        <StaticDataContext.Provider value={data}>
            {children}
        </StaticDataContext.Provider>
    );
};