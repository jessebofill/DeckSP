import { Focusable, GamepadButton, ModalPosition, ScrollPanelGroup } from 'decky-frontend-lib';
import { FC } from 'react';

export interface ScrollableWindowProps {
    height: string;
    fadePercent: number;
}
export const ScrollableWindow: FC<ScrollableWindowProps> = ({ height, fadePercent, children }) => {
    return (
        <>
            <style>
                {`.modal-position-container .gamepaddialog_ModalPosition_30VHl {
          top: 0;
          bottom: 0;
          padding: 0;
        }`}
            </style>
            <div
                className='modal-position-container'
                style={{
                    position: 'relative',
                    height: height,
                    WebkitMaskImage: `linear-gradient(to bottom, transparent, black ${fadePercent}%, black ${100 - fadePercent}%, transparent 100%)`
                }}>
                <ModalPosition>
                    {/* @ts-ignore */}
                    <ScrollPanelGroup focusable={false} style={{ flex: 1, minHeight: 0 }}>
                        <Focusable
                            onActivate={() => { }}
                            noFocusRing={true}
                            actionDescriptionMap={{
                                [GamepadButton.DIR_UP]: 'Scroll Up',
                                [GamepadButton.DIR_DOWN]: 'Scroll Down'
                            }}>
                            {children}
                        </Focusable>
                    </ScrollPanelGroup>
                </ModalPosition>
            </div>
        </>
    );
};
