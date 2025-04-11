import { FC, FC17 } from 'react';
import { effectDescriptions } from '../../defines/effectDescriptions';
import { Focusable, ModalRoot, showModal } from '@decky/ui';

interface EffectInfoProps {
    effect: keyof typeof effectDescriptions;
}

export const EffectInfo: FC17<EffectInfoProps> = ({ effect, children }) => {
    return (
        <Focusable onMenuActionDescription='Effect Info' onMenuButton={() => showModal(<EffectInfoModal effect={effect} />)}>
            {children}
        </Focusable>
    );
};

interface EffectInfoModalProps {
    effect: keyof typeof effectDescriptions;
    closeModal?: () => void;
}

export const EffectInfoModal: FC<EffectInfoModalProps> = ({ effect, closeModal }) => {
    return (
        <ModalRoot onCancel={closeModal} onOK={closeModal}>
            <EffectDescription effect={effect} />
        </ModalRoot>
    );
};

interface EffectInfoModalProps {
    effect: keyof typeof effectDescriptions;
}

export const EffectDescription: FC<EffectInfoModalProps> = ({ effect }) => {
    const { title, description } = effectDescriptions[effect];
    return (
        <div>
            <div style={{ textDecoration: 'underline', marginBottom: '20px' }}>
                <strong>{title}</strong>
            </div>
            <div style={{ fontSize: '12px' }}>
                {description}
            </div>
        </div>
    );
};