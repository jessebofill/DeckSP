import { DialogButton, Focusable, GamepadButton, gamepadContextMenuClasses, Menu, MenuItem, showContextMenu } from '@decky/ui';
import { FC, useState, useLayoutEffect } from 'react';
import { DSPPageType, dspPageDict, DSPPageOrder, getDefaultDSPPageOrder } from '../../defines/dspPageTypeDictionary';
import { ReorderableEntry, ReorderableList } from '../generic/ReorderableList';
import { MenuItemNoClose } from '../generic/MenuItemNoClose';

interface ReorderDspPagesProps {
    currentOrder: DSPPageOrder;
    setConfirm: (order: DSPPageOrder) => void;
}

const ReorderDspPages: FC<ReorderDspPagesProps> = ({ currentOrder, setConfirm }) => {
    const [order, setOrder] = useState(currentOrder);
    const entries: ReorderableEntry<DSPPageType>[] = order.map((pageType, index) => ({
        data: pageType,
        position: index,
        label: <div style={{ padding: '0 16px' }}>
            {dspPageDict[pageType].displayName}
        </div>
    }));

    const change = (order: DSPPageOrder) => {
        setConfirm(order);
        setOrder(order);
    };
    useLayoutEffect(() => { change(currentOrder) }, [currentOrder]);

    return (
        <Focusable
            style={{ padding: '0' }}
            className={gamepadContextMenuClasses.contextMenuItem}
            onMouseEnter={event => {
                const element = event.currentTarget;
                element.style.background = window.getComputedStyle(element).background;
            }}
        >
            <ReorderableList
                entries={entries}
                onSave={entries => change(entries.map(entry => entry.data!) as DSPPageOrder)}
                reorderButton={GamepadButton.OK}
                saveButtons={GamepadButton.START}
                lastItemBottomSeparator='none'
            />
        </Focusable>
    );
};

interface ReorderDspPagesMenuProps {
    currentOrder: DSPPageOrder;
    onConfirm: (order: DSPPageOrder) => void;
}

const ReorderDspPagesMenu: FC<ReorderDspPagesMenuProps> = ({ currentOrder, onConfirm }) => {
    const [order, setOrder] = useState(currentOrder);
    let confirm = () => { };
    const resetLabel = 'Reset';
    const confirmLabel = 'Confirm';
    const reset = () => setOrder([...getDefaultDSPPageOrder()]);
    return (
        <Menu
            onCancelActionDescription='Cancel'
            onMenuButton={() => {
                confirm();
                SteamClient.Input.ControllerKeyboardSetKeyState(41, true);
                SteamClient.Input.ControllerKeyboardSetKeyState(41, false);
            }}
            onMenuActionDescription={confirmLabel}
            onButtonDown={e => e.detail.button === GamepadButton.SELECT && reset()}
            actionDescriptionMap={{ [GamepadButton.SELECT]: resetLabel }}
            //@ts-ignore
            label={<h2 style={{ margin: 0 }}>Reorder Pages</h2>}
        >
            <ReorderDspPages currentOrder={order} setConfirm={order => confirm = () => onConfirm(order)} />
            <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
            <MenuItemNoClose onOKActionDescription={resetLabel} onClick={reset}>
                {resetLabel}
            </MenuItemNoClose>
            <MenuItem onOKActionDescription={confirmLabel} onClick={() => confirm()}>
                {confirmLabel}
            </MenuItem>
        </Menu>
    );
};

export const ReorderDspPagesButton: FC<ReorderDspPagesMenuProps> = ({ ...menuProps }) => {
    return (
        <DialogButton onClick={() => showContextMenu(<ReorderDspPagesMenu {...menuProps} />)}>
            Reorder Pages
        </DialogButton>
    );
};
