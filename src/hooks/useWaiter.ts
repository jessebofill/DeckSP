import { usePluginContext } from './contextHooks';

export function useWaiter<Args extends any[], promiseType>(waitFor: (...args: Args) => Promise<promiseType>, onFinish?: (promiseRes: promiseType) => void) {
    const { setReady } = usePluginContext();
    if (!setReady) return undefined;

    return async (...args: Args) => {
        setReady(false);
        const res = await waitFor(...args);
        setReady(true);
        onFinish?.(res);
        return res;
    };
};