import { ZiskMeta } from '@/schema/documents/ZiskMeta'
import { UserSettings } from '@/schema/models/UserSettings'
import { createContext } from 'react'

export interface ZiskContext {
  ziskMeta: ZiskMeta | null
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
}

export const ZiskContext = createContext<ZiskContext>({
  ziskMeta: null,
  updateSettings: () => Promise.resolve(),
})
