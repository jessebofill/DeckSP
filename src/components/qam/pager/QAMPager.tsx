import { Children, FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { Focusable, GamepadButton, GamepadEvent, scrollPanelClasses } from '@decky/ui';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CustomButton } from '../../generic/CustomButton';
import { playUISound } from '../../../lib/utils';
import { deckyQamTabClass } from '../../../defines/cssClasses';


export class PagerLinker {
    numPages = 0;
    page = 0;
    onSetNumPages: ((numPages: number) => void) | null = null;
    pagerSetPage: ((page: number) => void) | null = null;
    switcherSetPage: ((page: number) => void) | null = null;

    setPage(page: number) {
        this.page = page;
        this.pagerSetPage?.(this.page);
        this.switcherSetPage?.(this.page);
    }
    setNumPages(numPages: number) {
        this.numPages = numPages;
        this.onSetNumPages?.(this.numPages);
    }
    linkSwitcher(setPage: (page: number) => void, setNumPages: (numPages: number) => void) {
        this.switcherSetPage = setPage;
        this.onSetNumPages = setNumPages;
        if (this.numPages > 0) setNumPages(this.numPages);
    }
    linkPager(setPage: (page: number) => void, numPages: number) {
        this.pagerSetPage = setPage;
        this.setNumPages(numPages);
        if (this.page > 0) setPage(this.page);
    }
}

export interface QAMPagerProps {
    children: ReactNode;
    pagerLinker: PagerLinker;
    noWrap?: boolean;
}

export const QAMPager: FC<QAMPagerProps> = ({ children, pagerLinker, noWrap }) => {
    const [page, setPage] = useState(0);
    const pages = Children.toArray(children) as ReactElement[];
    useEffect(() => pagerLinker.linkPager(setPage, pages.length), [pages.length, pagerLinker]);

    return (
        //@ts-ignore valve removed focucable props 'retainFocus' and 'focusableIfNoChildren'and replaced them with 'focusableIfEmpty' in Steam Client build 9-23-25
        <Focusable focusableIfEmpty={true}> 
            <Focusable
                onButtonDown={(evt: GamepadEvent) => {
                    switch (evt.detail.button) {
                        case GamepadButton.BUMPER_LEFT:
                            pagerLinker.setPage(getNewIndex(page, -1, pagerLinker.numPages, noWrap));
                            playUISound('/sounds/deck_ui_tab_transition_01.wav');
                            break;
                        case GamepadButton.BUMPER_RIGHT:
                            pagerLinker.setPage(getNewIndex(page, 1, pagerLinker.numPages, noWrap));
                            playUISound('/sounds/deck_ui_tab_transition_01.wav');
                            break;
                    }
                }}
                actionDescriptionMap={{
                    [GamepadButton.BUMPER_LEFT]: 'Previous Page',
                    [GamepadButton.BUMPER_RIGHT]: 'Next Page'
                }}
            >
                {pages[page]}
                <style>{`
                .${deckyQamTabClass}.${scrollPanelClasses.ScrollPanel} {
                    scroll-padding-top: 150px;
                }
            `}</style>
            </Focusable>
        </Focusable>
    );
};

export interface QAMPageSwitcherProps {
    pagerLinker: PagerLinker;
    onPageChange?: (page: number) => void;
    noWrap?: boolean;
}

const buttonStyle = { height: '28px', width: '40px', minWidth: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' };

export const QAMPageSwitcher: FC<QAMPageSwitcherProps> = ({ pagerLinker, onPageChange, noWrap }) => {
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        pagerLinker.linkSwitcher((page: number) => {
            setPage(page);
            onPageChange?.(page);
        }, setNumPages);
        return () => pagerLinker.setPage(0);
    }, []);

    return (
        <>
            <div style={{ fontSize: '10px' }}>{`${numPages === 0 ? 0 : page + 1} / ${numPages}`}</div>
            <CustomButton
                onOKActionDescription='Previous Page'
                style={buttonStyle}
                onClick={() => pagerLinker.setPage(getNewIndex(page, -1, numPages, noWrap))}
                audioSFX={'deck_ui_tab_transition_01.wav'}
            >
                <FaChevronLeft size={'.8em'} viewBox='20 0 320 512' />
            </CustomButton>
            <CustomButton
                onOKActionDescription='Next Page'
                style={buttonStyle}
                onClick={() => pagerLinker.setPage(getNewIndex(page, 1, numPages, noWrap))}
                audioSFX={'deck_ui_tab_transition_01.wav'}
            >
                <FaChevronRight size={'.8em'} viewBox='-20 0 320 512' />
            </CustomButton>
        </>
    );
};

type direction = -1 | 1;
function getNewIndex(current: number, dir: direction, numPages: number, noWrap?: boolean) {
    if (dir > 0) {
        let newIndex = (current + 1) % numPages;
        return newIndex === 0 && noWrap ? numPages - 1 : newIndex;
    } else {
        let newIndex = current - 1;
        return newIndex < 0 ? (!noWrap ? numPages - 1 : 0) : newIndex;
    }
};