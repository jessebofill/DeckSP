import { useState, FC17, useEffect } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';
import { PluginStateContext } from '../../contexts/contexts';
import { DspSettingsContext } from '../../contexts/contexts';
import { FlatpakFixProvider } from './FlatpakFixContextProvider';

export const PluginDataProvider: FC17<{}> = ({ children }) => {
    const { data } = usePluginContext();
    if (!data) return null;

    const [plugin, setPlugin] = useState(data.plugin);
    const [dsp, setDsp] = useState(data.dsp);
    const [pluginError, setPluginError] = useState<Error | undefined>(data.errors.plugin);
    const [dspError, setDspError] = useState<Error | undefined>(data.errors.dsp);

    useEffect(() => {
        setPlugin(data.plugin);
        setDsp(data.dsp);
        setPluginError(data.errors.plugin);
        setDspError(data.errors.dsp);
    }, [data]);

    return (
        <PluginStateContext.Provider value={{ data: plugin, setData: setPlugin, error: pluginError, setError: setPluginError }}>
            <FlatpakFixProvider>
                <DspSettingsContext.Provider value={{ data: dsp, setData: setDsp, error: dspError, setError: setDspError }}>
                    {children}
                </DspSettingsContext.Provider>
            </FlatpakFixProvider>
        </PluginStateContext.Provider>
    );
};