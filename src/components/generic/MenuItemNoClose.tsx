import { MenuItemProps, Focusable, gamepadContextMenuClasses } from '@decky/ui';
import { FC } from 'react';

interface MenuItemNoCloseProps extends Omit<MenuItemProps, 'bInteractableItem' | 'onSelected' | 'onMouseEnter' | 'onMoveRight' | 'selected' | 'bPlayAudio' | 'tone'> {
    className?: string;
}
export const MenuItemNoClose: FC<MenuItemNoCloseProps> = ({ onClick, disabled, className, children, ...props }) => {
    return <Focusable
        className={`${gamepadContextMenuClasses.contextMenuItem} contextMenuItem` + (className ? ` ${className}` : '') + (disabled ? ' disabled' : '')}
        focusClassName={gamepadContextMenuClasses.Focused}
        onActivate={disabled ? undefined : onClick}
        noFocusRing={true}
        {...props}
    >
        {children}
    </Focusable>;
};
