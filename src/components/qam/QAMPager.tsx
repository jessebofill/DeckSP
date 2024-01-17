import { ReactElement, VFC, useEffect, useState } from 'react';
import { Focusable, GamepadButton, GamepadEvent, quickAccessMenuClasses } from 'decky-frontend-lib';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Log } from '../../lib/log';
import { CustomButton } from '../generic/CustomButton';
import { playUISound } from '../../lib/utils';


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
    pagerLinker: PagerLinker;
    pages: ReactElement[];
    noWrap?: boolean;
}

export const QAMPager: VFC<QAMPagerProps> = ({ pagerLinker, pages, noWrap }) => {
    const [page, setPage] = useState(0);
    useEffect(() => pagerLinker.linkPager(setPage, pages.length), []);
    useEffect(() => Log.log('linker', pagerLinker), [])

    return (
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
        </Focusable>
    );
};

export interface QAMPageSwitcherProps {
    title: string,
    pagerLinker: PagerLinker;
    noWrap?: boolean;
}

const buttonStyle = { height: '28px', width: '40px', minWidth: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' };

export const QAMPageSwitcher: VFC<QAMPageSwitcherProps> = ({ title, pagerLinker, noWrap }) => {
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        pagerLinker.linkSwitcher(setPage, setNumPages)
        return () => {
            pagerLinker.setPage(0);
            Log.log('switchc unmounting')
        }
    }, []);
    useEffect(() => Log.log('mounting swwitcher', pagerLinker), []);

    return (
        <Focusable
            style={{
                display: 'flex',
                padding: '0',
                flex: 'auto',
                boxShadow: 'none',
            }}
            className={quickAccessMenuClasses.Title}
        >
            <div style={{ marginRight: "auto" }}>{title}</div>
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
        </Focusable>
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