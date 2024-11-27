import { APP_MENU } from "@/constants/menu";
import { useAppMenuStateStore } from "@/store/useAppMenuStateStore";
import { ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";

interface AppMenuProps {
    view: 'desktop' | 'mobile';
}

export default function AppMenu(props: AppMenuProps) {
    const isOpen = useAppMenuStateStore((state) => state.isOpen);
    const closeMenu = useAppMenuStateStore((state) => state.close);

    return (
        <MenuList>
            {Object.entries(APP_MENU).map(([slug, menuItem]) => {
                return (
                    <MenuItem
                        key={slug}
                        onClick={() => {
                            
                            closeMenu();
                        }}
                        selected={true}
                        disabled={menuItem.disabled}
                    >
                        <ListItemIcon>
                            {menuItem.icon}
                        </ListItemIcon>
                        {isOpen && (
                            <ListItemText primary={menuItem.label} secondary={menuItem.description} />
                        )}
                    </MenuItem>
                )
            })}
        </MenuList>
    )
}
