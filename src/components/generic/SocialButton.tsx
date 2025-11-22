import { DialogButton, Focusable, showModal } from '@decky/ui';
import { FC17, ReactNode } from 'react';
import { HiQrCode } from 'react-icons/hi2';
import { QAMHiglightable, QAMHiglightableProps } from '../qam/QAMHiglightable';
import { navigateUrl } from '../../lib/utils';
import { QRModal } from './QRModal';

export interface SocialButtonProps extends QAMHiglightableProps {
    icon: ReactNode;
    url: string;
    fontSize?: string;
    minHeight?: string;
    gap?: string;
}

export const SocialButton: FC17<SocialButtonProps> = ({ children, icon, url, fontSize, minHeight, gap, bottomSeparator }) => {
    return (
        <QAMHiglightable bottomSeparator={bottomSeparator}>
            <Focusable
                style={{ display: 'flex', gap: gap ?? '15px' }}
                navEntryPreferPosition={2}
            >
                <div style={{ display: 'flex', fontSize: '1.5em', justifyContent: 'center', alignItems: 'center' }}>
                    {icon}
                </div>
                <DialogButton
                    onClick={() => navigateUrl(url)}
                    onOKActionDescription={window.WebBrowserPlugin?.openInBrowser ? 'Open in Web Browser' : undefined}
                    style={{ padding: '0px', minHeight: minHeight ?? '30px', fontSize }}
                >
                    {children}
                </DialogButton>
                <DialogButton
                    onOKActionDescription="Show QR Code"
                    onClick={() => showModal(<QRModal url={url} />)}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0px',
                        maxWidth: '40px',
                        minWidth: 'auto',
                    }}
                >
                    <HiQrCode />
                </DialogButton>
            </Focusable>
        </QAMHiglightable>
    )
};