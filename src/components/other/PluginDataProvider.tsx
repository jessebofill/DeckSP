import { useState, FC, useEffect } from 'react';
import { usePluginContext } from '../../hooks/contextHooks';
import { PluginSettingsContext } from '../../contexts/contexts';
import { DspSettingsContext } from '../../contexts/contexts';

export const PluginDataProvider: FC<{}> = ({ children }) => {
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
        <PluginSettingsContext.Provider value={{ data: plugin, setData: setPlugin, error: pluginError, setError: setPluginError }}>
            <DspSettingsContext.Provider value={{ data: dsp, setData: setDsp, error: dspError, setError: setDspError }}>
                {children}
            </DspSettingsContext.Provider>
        </PluginSettingsContext.Provider>
    );
};