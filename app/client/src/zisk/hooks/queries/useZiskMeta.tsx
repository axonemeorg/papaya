import { getOrCreateZiskMeta } from '@/database/queries'
import { ZiskMeta } from '@/schema/documents/ZiskMeta'
import { useQuery } from '@tanstack/react-query'

export const useZiskMeta = () =>
  useQuery<ZiskMeta | null>({
    queryKey: ['ziskMeta'],
    queryFn: getOrCreateZiskMeta,
    enabled: true,
    initialData: null,
  })
