import { FC, useRef, KeyboardEvent } from 'react';
import { Log } from '../../lib/log';
import { getFocusNav } from '../../lib/utils';

export const EditorPage: FC<{}> = ({ }) => {
    return (
        <div
            style={{
                position: 'absolute',
                // height: '-webkit-fill-available',
                width: '100%',
                top: 'var(--basicui-header-height)',
                bottom: 'var(--gamepadui-current-footer-height)'
            }}
        >
            <Editor />
        </div>
    );
};

export const Editor: FC<{}> = ({ }) => {
    const className = 'editor-container';
    const textArea = useRef<HTMLTextAreaElement>(null);
    // const [cursorPos, setCursorPos] = useState<number>();

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        const textarea = event.currentTarget;
        Log.log('key press', event)

        if (arrowKeys.includes(event.key) && textarea.value.length !== 0 && textarea.selectionStart === 0 && textarea.selectionEnd === textarea.value.length) {
            event.stopPropagation();
        }
        if (event.key === "Tab") {
            // SteamClient.Input.ControllerKeyboardSendText('\x09');
            // event.preventDefault();
            event.stopPropagation();
        }
    };


    // useEffect(() => {
    //     if (textArea.current && cursorPos !== undefined) setTimeout(() => textArea.current!.selectionEnd = cursorPos, 1)
    // }, [cursorPos])

    return (
        <>
            {/* <Focusable
                onGamepadFocus={e => {
                    console.log('should send focus')
                    editorRef.current?.focus()
                }}
                onActivate={() => { }}
                className={className}
                style={{
                    height: '100%',
                    width: '100%',
                    background: '#1b232c'
                }}
                noFocusRing={true}
                // onKeyDown={}
            > */}
                {/* <style>
                    {`
                    .${className} textarea::-webkit-scrollbar {
                        display: initial !important;
                        width: 14px;
                        height: 14px;
                    }
                    .${className} textarea::-webkit-scrollbar-corner {
                        background: transparent;
                    }
                `}
                </style> */}
                <textarea
                    onKeyDown={handleKeyDown}
                    onFocus={e => setTimeout(() => { //bs workaround because steam has weird bug when focusing via keyboard it spams direction input until text cusrsor reaches the bottom line
                        const gamepadSources = getFocusNav()?.m_rgGamepadInputSources;
                        if (gamepadSources) gamepadSources.filter(source => source.m_ButtonRepeatHandler?.m_inputRepeatGenerator?.m_ActiveInputId).forEach(source => source.Reset?.());
                        else {
                            Log.warnN('Editor Component', 'Gamepad sources could not be found. Has Steam changed FocusNavController?');
                            e.target.selectionStart = e.target.value.length;
                            e.target.selectionEnd = e.target.value.length;
                        }
                    }, 1)}
                    ref={textArea}
                    spellCheck={false}
                    style={{
                        height: '-webkit-fill-available',
                        width: '-webkit-fill-available',
                        marginLeft: '6px',
                        padding: '0',
                        outline: 'none',
                        border: 'none',
                        background: '#1b232c',
                        whiteSpace: 'nowrap',
                        color: '#b6bbbe',
                        caretColor: '#ffffffe6',
                        fontFamily: 'monospace !important',
                        fontSize: '14px',
                        lineHeight: '20px'
                    }}
                />
            {/* </Focusable> */}
        </>
    );
};