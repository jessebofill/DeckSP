import { Focusable } from '@decky/ui';
import { FC17 } from 'react';
import { ScrollableWindowRelative } from './ScrollableWindow';
import ExternalLink from './ExternalLink';

export const QAMErrorWrapper: FC17<{}> = ({ children }) => {
    return (
        <Focusable
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '-webkit-fill-available',
                width: '-webkit-fill-available',
                position: 'absolute'
            }}
        >
            <ScrollableWindowRelative>
                <div style={{ padding: '10px 15px', wordBreak: 'break-word', whiteSpace: 'pre-wrap', background: '#3f202082' }}>
                    {children}
                </div>
                <div style={{ padding: '10px 15px', fontSize: '14px', fontStyle: 'italic' }}>
                    Reloading the plugin or rebooting the deivce may fix this issue. If neither of these steps are effective, you can reach out for support at <ExternalLink href='https://github.com/jessebofill/DeckSP/issues' />
                </div>
            </ScrollableWindowRelative>
        </Focusable>
    );
};