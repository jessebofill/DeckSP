import { CSSProperties, Context, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { FadeSpinner } from './FadeSpinner';
import { QAMErrorWrapper } from './QAMErrorWrapper';
import { DataProviderSetData } from '../../contexts/contexts';

export type AsyncDataContext<DataType> = { 
    data?: DataType; 
    setData?: DataProviderSetData<DataType> 
    error?: Error; 
};

export interface AsyncDataProviderProps<DataType> {
    handler: (setData: DataProviderSetData<DataType>, setError: Dispatch<SetStateAction<Error | undefined>>) => Promise<any>;
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
                {!!error ? <QAMErrorWrapper>{`Error: ${error.message}`}</QAMErrorWrapper> : children}
            </FadeSpinner>
        </Context.Provider>
    );
};
