import { Category } from "@/types/get";
import { Icon } from "@mui/material";
import { DEFAULT_AVATAR } from "../pickers/AvatarPicker";
import { AvatarVariant } from "@/types/enum";
import { ImageAvatar } from "../pickers/ImageAvatarPicker";


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