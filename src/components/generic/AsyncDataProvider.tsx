import { CSSProperties, Context, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { FadeSpinner } from './FadeSpinner';

export type AsyncDataProviderSetData<DataType> = Dispatch<SetStateAction<DataType | undefined>>;
export type AsyncDataProviderSetError = Dispatch<SetStateAction<Error | undefined>>;

export type AsyncDataContext<DataType> = { 
    data?: DataType; 
    error?: Error; setData?: AsyncDataProviderSetData<DataType> 
};

export interface AsyncDataProviderProps<DataType> {
    handler: (setData: AsyncDataProviderSetData<DataType>, setError: Dispatch<SetStateAction<Error | undefined>>) => Promise<any>;
    Context: Context<AsyncDataContext<DataType>>;
    containerClass?: string;
    containerStyle?: CSSProperties;
    children: ReactNode;
}

export function AsyncDataProvider<DataType>({ children, handler, Context, containerClass, containerStyle }: AsyncDataProviderProps<DataType>) {
    const [data, setData] = useState<DataType>();
    const [error, setError] = useState<Error>();

    useEffect(() => { handler(setData, setError) }, []);

    return (
        <Context.Provider value={{ data, setData, error }}>
            <FadeSpinner isLoading={!error && !data} className={containerClass} style={containerStyle} >
                {!!error ? <div>{`Error: ${error.message}`}</div> : children}
            </FadeSpinner>
        </Context.Provider>
    );
};
