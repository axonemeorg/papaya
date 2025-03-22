import { UserTheme } from "@/types/schema";

import jellies from '@/assets/images/factory-themes/jellies.jpg?inline'

export const ziskFactoryUserThemes: UserTheme[] = [
    {
        _id: 'ZISK_FACTORY_USER_THEME_PURE_RED',
        type: 'ZISK_USER_THEME',
        background: { image: jellies },
        primaryColor: '#0000BB',
    }
]
