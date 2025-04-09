import { Backend } from '../controllers/Backend';
import { useEELParameters, useEELTriggerContext } from './contextHooks';
import { useWaiter } from './useWaiter';

export function useSetEelDefaults() {
    const { setError } = useEELParameters();
    const { setData: setTrigger } = useEELTriggerContext();
    const waitFor = async () => Backend.resetEELParams().catch(e => e);
    return useWaiter(waitFor, (res) => res instanceof Error ? setError?.(res) : setTrigger?.({}));
};