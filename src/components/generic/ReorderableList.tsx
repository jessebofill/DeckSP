import { Fragment, JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from 'react';
import { Field, FieldProps, Focusable, GamepadButton, GamepadEvent } from '@decky/ui';

/**
 * A ReorderableList entry of type <T>.
 * @param label The name of this entry in the list.
 * @param data Optional data to connect to this entry.
 * @param position The position of this entry in the list.
 */
export type ReorderableEntry<T = undefined> = {
    label?: ReactNode;
    description?: ReactNode
    data?: T;
    position: number;
};

/**
 * Properties for a ReorderableList component of type <T>.
 *
 * @param animate If the list should animate. @default true
 */
export type ReorderableListProps<T> = {
    entries: ReorderableEntry<T>[];
    onSave: (entries: ReorderableEntry<T>[]) => void;
    interactables?: JSXElementConstructor<{ entry: ReorderableEntry<T> }>;
    fieldProps?: FieldProps;
    animate?: boolean;
    reorderButton?: GamepadButton
    saveButtons?: GamepadButton | GamepadButton[];
    onOkDescription?: string;
    lastItemBottomSeparator?: FieldProps['bottomSeparator'];
    onButtonPress?: (evt: GamepadEvent, entry: ReorderableEntry<T>) => void;
};

/**
 * A component for creating reorderable lists.
 *
 * See an example implementation {@linkplain https://github.com/Tormak9970/Component-Testing-Plugin/blob/main/src/testing-window/ReorderableListTest.tsx here}.
 */
export function ReorderableList<T>(props: ReorderableListProps<T>) {
    const saveButtons = props.saveButtons ?? GamepadButton.CANCEL;
    const reorderButton = props.reorderButton ?? GamepadButton.SECONDARY;
    if (props.animate === undefined) props.animate = true;
    const [entryList, setEntryList] = useState<ReorderableEntry<T>[]>(
        [...props.entries].sort((a: ReorderableEntry<T>, b: ReorderableEntry<T>) => a.position - b.position),
    );
    const [reorderEnabled, setReorderEnabled] = useState<boolean>(false);

    useEffect(() => {
        setEntryList([...props.entries].sort((a: ReorderableEntry<T>, b: ReorderableEntry<T>) => a.position - b.position));
    }, [props.entries]);

    function toggleReorderEnabled(): void {
        let newReorderValue = !reorderEnabled;
        setReorderEnabled(newReorderValue);
        if (!newReorderValue) props.onSave(entryList);
    }

    const shouldSaveOnButton = (button: GamepadButton) => button === saveButtons || saveButtons instanceof Array && saveButtons.includes(button);

    function handleButton(e: Event) {
        const button = (e as CustomEvent).detail.button;
        if (button === reorderButton) {
            toggleReorderEnabled()
        }
        if (reorderEnabled && shouldSaveOnButton(button)) {
            setReorderEnabled(false);
            props.onSave(entryList);
        }
    }

    const actionDescription = {
        [reorderButton]: reorderEnabled ? 'Save Order' : 'Reorder',
    }

    return (
        <Fragment>
            <div
                style={{
                    width: 'inherit',
                    height: 'inherit',
                    flex: '1 1 1px',
                    scrollPadding: '48px 0px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignContent: 'stretch',
                }}
            >
                <Focusable
                    actionDescriptionMap={actionDescription}
                    onClick={reorderButton === GamepadButton.OK ? toggleReorderEnabled : () => reorderEnabled && setReorderEnabled(false)}
                    onButtonDown={handleButton}
                >
                    {entryList.map((entry: ReorderableEntry<T>, index: number) => (
                        <ReorderableItem
                            animate={props.animate!}
                            listData={entryList}
                            entryData={entry}
                            reorderEntryFunc={setEntryList}
                            reorderEnabled={reorderEnabled}
                            fieldProps={props.lastItemBottomSeparator === undefined ? props.fieldProps : Object.assign<FieldProps, FieldProps>(props.fieldProps ?? {}, index === entryList.length - 1 ? { bottomSeparator: props.lastItemBottomSeparator } : {})}
                            onButtonPress={props.onButtonPress}
                        >
                            {props.interactables ? <props.interactables entry={entry} /> : null}
                        </ReorderableItem>
                    ))}
                </Focusable>
            </div>
        </Fragment>
    );
}

/**
 * Properties for a ReorderableItem component of type <T>
 */
export type ReorderableListEntryProps<T> = {
    fieldProps?: FieldProps;
    listData: ReorderableEntry<T>[];
    entryData: ReorderableEntry<T>;
    reorderEntryFunc: CallableFunction;
    reorderEnabled: boolean;
    animate: boolean;
    children: ReactElement | null;
    onButtonPress?: (evt: GamepadEvent, entry: ReorderableEntry<T>) => void
};

function ReorderableItem<T>(props: ReorderableListEntryProps<T>) {
    const [isSelected, _setIsSelected] = useState<boolean>(false);
    const [isSelectedLastFrame, setIsSelectedLastFrame] = useState<boolean>(false);
    const listEntries = props.listData;

    function onReorder(e: Event): void {
        const event = e as CustomEvent;
        if (!props.reorderEnabled) {
            props.onButtonPress && props.onButtonPress(e as any, props.entryData)
            return;
        }
        const currentIdx = listEntries.findIndex((entryData: ReorderableEntry<T>) => entryData === props.entryData);
        const currentIdxValue = listEntries[currentIdx];
        if (currentIdx < 0) return;

        let targetPosition: number = -1;
        if (event.detail.button == GamepadButton.DIR_DOWN) {
            targetPosition = currentIdxValue.position + 1;
        } else if (event.detail.button == GamepadButton.DIR_UP) {
            targetPosition = currentIdxValue.position - 1;
        }

        if (targetPosition >= listEntries.length || targetPosition < 0) return;

        let otherToUpdate = listEntries.find((entryData: ReorderableEntry<T>) => entryData.position === targetPosition);
        if (!otherToUpdate) return;

        let currentPosition = currentIdxValue.position;

        currentIdxValue.position = otherToUpdate.position;
        otherToUpdate.position = currentPosition;

        props.reorderEntryFunc(
            [...listEntries].sort((a: ReorderableEntry<T>, b: ReorderableEntry<T>) => a.position - b.position),
        );
    }

    async function setIsSelected(val: boolean) {
        _setIsSelected(val);
        // Wait 3 frames, then set. I have no idea why, but if you dont wait long enough it doesn't work.
        for (let i = 0; i < 3; i++) await new Promise((res) => requestAnimationFrame(res));
        setIsSelectedLastFrame(val);
    }

    if (!props.fieldProps) props.fieldProps = {}

    const {
        actionDescriptionMap,
        onOKActionDescription,
        onSecondaryActionDescription,
        onOptionsActionDescription,
        onMenuActionDescription,
        ...otherFieldProps
    } = props.fieldProps

    const actionDescriptionProps = props.reorderEnabled ?
        {} :
        {
            actionDescriptionMap,
            onOKActionDescription,
            onSecondaryActionDescription,
            onOptionsActionDescription,
            onMenuActionDescription,
        }

    return (
        <div
            style={
                props.animate
                    ? {
                        transition:
                            isSelected || isSelectedLastFrame
                                ? ''
                                : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)', // easeOutQuart https://easings.net/#easeOutQuart
                        transform: !props.reorderEnabled || isSelected ? 'scale(1)' : 'scale(0.9)',
                        opacity: !props.reorderEnabled || isSelected ? 1 : 0.7,
                    }
                    : {}
            }
        >
            <Field
                label={props.entryData.label}
                description={props.entryData.description}
                {...actionDescriptionProps}
                {...otherFieldProps}
                focusable={!props.children}
                onButtonDown={onReorder}
                onGamepadBlur={() => setIsSelected(false)}
                onGamepadFocus={() => setIsSelected(true)}
            >
                <Focusable style={{ display: 'flex', width: '100%', position: 'relative' }}>{props.children}</Focusable>
            </Field>
        </div>
    );
}
