import { PapayaMeta } from '@/schema/documents/PapayaMeta'
import { UserSettings } from '@/schema/models/UserSettings'
import { createContext } from 'react'

export interface PapayaContext {
  papayaMeta: PapayaMeta | null
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
}

export const PapayaContext = createContext<PapayaContext>({
  papayaMeta: null,
  updateSettings: () => Promise.resolve(),
})
