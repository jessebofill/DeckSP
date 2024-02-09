import { quickAccessMenuClasses, Focusable } from 'decky-frontend-lib';
import { FC } from 'react';
import { addClasses } from '../../lib/utils';
import { CurrentProfile } from '../profile/CurrentProfile';
import { deckyQamTabClass, titleViewClasses } from '../../defines/cssClasses';
import { PagerLinker, QAMPageSwitcher } from './QAMPager';

interface QAMTitleViewProps {
    title: string;
    pagerLinker: PagerLinker;
}

export const QAMTitleView: FC<QAMTitleViewProps> = ({ pagerLinker, title }) => {

    const underTitleHeight = 24;

    return (
        <Focusable>
            <style>{`
                .${deckyQamTabClass} .${quickAccessMenuClasses.Title}:not(.${titleViewClasses.innerContainer}) {
                    align-items: flex-start;
                }
            `}</style>
            <div style={{ flex: 'auto' }}>
                <div>
                    <Focusable
                        style={{
                            display: 'flex',
                            padding: '0',
                            flex: 'auto',
                            boxShadow: 'none'
                        }}
                        className={addClasses(quickAccessMenuClasses.Title, titleViewClasses.innerContainer)}
                    >
                        <div style={{ marginRight: "auto" }}>{title}</div>
                        <QAMPageSwitcher pagerLinker={pagerLinker} />
                    </Focusable>
                    <div
                        className={titleViewClasses.belowTitle}
                        style={{
                            position: 'relative',
                            height: `${underTitleHeight}px`
                        }}
                    />
                    <div
                        className={titleViewClasses.belowTitle}
                        style={{
                            position: 'absolute',
                            marginTop: `${-underTitleHeight}px`,
                            padding: '5px 16px 0',
                            lineHeight: `${underTitleHeight}px`,
                            left: 0,
                            right: 0
                        }}
                    >
                        <CurrentProfile useMarquee={true} />
                    </div>
                </div>
            </div>
        </ Focusable>
    );
};
