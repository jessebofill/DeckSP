import { Context, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { DataContext, DataProviderSetData, DataProviderSetError } from '../../contexts/contexts';
import { Log } from '../../lib/log';

export type AsyncDataProviderSetReady = Dispatch<SetStateAction<boolean>>;

export interface AsyncDataContext<DataType> extends DataContext<DataType> {
    ready?: boolean;
    setReady?: Dispatch<SetStateAction<boolean>>;
};

export interface AsyncDataProviderProps<DataType> {
    handler: (setData: DataProviderSetData<DataType>, setReady: AsyncDataProviderSetReady, setError: DataProviderSetError) => Promise<any>;
    Context: Context<AsyncDataContext<DataType>>;
    children: ReactNode;
}

export function AsyncDataProvider<DataType>({ children, handler, Context }: AsyncDataProviderProps<DataType>) {
    const [data, setData] = useState<DataType>();
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<Error>();
    useEffect(() => { handler(setData, setReady, setError) }, []);

    return (
        <Context.Provider value={{ ready, setReady, data, setData, error, setError }}>
            {children}
        </Context.Provider>
    );
};
