import { Model } from '@ui/schema/support/orm/Model'
import z from 'zod'

export const AvatarVariant = z.enum(['TEXT', 'PICTORIAL', 'IMAGE'])
export type AvatarVariant = z.output<typeof AvatarVariant>

export const [CreateAvatar, Avatar] = Model.fromSchema({
  kind: z.literal('zisk:avatar'),
  content: z.string(),
  variant: AvatarVariant,
  primaryColor: z.string(),
  secondaryColor: z.string().optional().nullable(),
})
export type Avatar = z.output<typeof Avatar>
export type CreateAvatar = z.output<typeof CreateAvatar>
