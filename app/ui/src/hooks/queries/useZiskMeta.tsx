import { useQuery } from '@tanstack/react-query'
import { getOrCreateZiskMeta } from '@ui/database/queries'
import { ZiskMeta } from '@ui/schema/documents/ZiskMeta'

export const useZiskMeta = () =>
  useQuery<ZiskMeta | null>({
    queryKey: ['ziskMeta'],
    queryFn: getOrCreateZiskMeta,
    enabled: true,
    initialData: null,
  })
