import { Icon, SxProps, Theme } from "@mui/material";
import { DEFAULT_AVATAR } from "../pickers/AvatarPicker";
import { ImageAvatar } from "../pickers/ImageAvatarPicker";
import { AvatarVariant, Category } from "@/types/schema";

interface CategoryIconProps {
	category?: Category;
    compact?: boolean;
    sx?: SxProps<Theme>
}

export default function CategoryIcon(props: CategoryIconProps) {
	const avatar = props.category?.avatar ?? DEFAULT_AVATAR;

	switch (avatar.variant) {
        case AvatarVariant.Enum.PICTORIAL:
            return (
                <Icon style={{ display: 'block' }} sx={{ color: avatar.primaryColor, ...props.sx }}>
                    {avatar.content}
                </Icon>
            );
        case AvatarVariant.Enum.IMAGE:
            return (
                <ImageAvatar avatar={avatar} sx={{ width: '28px', height: '28px', ...props.sx }} />
            )
        default:
            return null;
    }
}