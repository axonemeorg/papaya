import { Icon } from "@mui/material";
import { DEFAULT_AVATAR } from "../pickers/AvatarPicker";
import { ImageAvatar } from "../pickers/ImageAvatarPicker";
import { AvatarVariant, Category } from "@/types/schema";

interface CategoryIconProps {
	category?: Category;
}

export default function CategoryIcon(props: CategoryIconProps) {
	const {
		avatarVariant,
		avatarPrimaryColor,
		avatarContent,
		avatarSecondaryColor,
	} = props.category ?? DEFAULT_AVATAR;

	const avatar = {
		avatarVariant,
		avatarPrimaryColor,
		avatarContent,
		avatarSecondaryColor,
	};

	switch (avatar.avatarVariant) {
        case AvatarVariant.Enum.PICTORIAL:
            return (
                <Icon sx={{ color: avatar.avatarPrimaryColor }}>
                    {avatar.avatarContent}
                </Icon>
            );
        case AvatarVariant.Enum.IMAGE:
            return (
                <ImageAvatar avatar={avatar} sx={{ width: '28px', height: '28px' }} />
            )
        default:
            return null;
    }
}