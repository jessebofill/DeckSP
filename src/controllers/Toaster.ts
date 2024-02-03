import { ServerAPI } from 'decky-frontend-lib';
import { ReactNode } from 'react';

export class Toaster {
    static toaster: ServerAPI['toaster'];

    static init(serverApi: ServerAPI) {
        this.toaster = serverApi.toaster;
    }

    static toast(title: ReactNode, message: string, durationMs: number = 4000, icon?: ReactNode) {
        this.toaster.toast({
            title,
            body: message,
            duration: durationMs,
            icon
        });
    }
}
