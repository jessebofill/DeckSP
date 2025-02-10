import {FunctionComponent, PropsWithChildren} from 'react';

declare module 'react' {
    type FC17<P = {}> = FunctionComponent<PropsWithChildren<P>>;
  }