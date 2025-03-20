import { Icon, SxProps, Theme } from '@mui/material'
import { DEFAULT_AVATAR } from '../pickers/AvatarPicker'
import { ImageAvatar } from '../pickers/ImageAvatarPicker'
import { Avatar, AvatarVariant } from '@/types/schema'

interface AvatarIconProps {
	avatar?: Avatar
	compact?: boolean
	sx?: SxProps<Theme>
	className?: string
}

export default function AvatarIcon(props: AvatarIconProps) {
	const avatar = props.avatar ?? DEFAULT_AVATAR

	switch (avatar.variant) {
		case AvatarVariant.Enum.PICTORIAL:
			return (
				<Icon className={props.className} fontSize="small" style={{ display: 'block' }} sx={{ color: avatar.primaryColor, ...props.sx }}>
					{avatar.content}
				</Icon>
			)
		case AvatarVariant.Enum.IMAGE:
			return <ImageAvatar className={props.className} avatar={avatar} sx={{ width: '28px', height: '28px', ...props.sx }} />
		default:
			return null
	}
}
