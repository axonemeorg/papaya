import { Account } from '@ui/schema/documents/Account'
import { Category } from '@ui/schema/documents/Category'

export const generateCategoryLink = (category: Category): string => {
  return `/journal/a?cs=${category._id}`
}

export const generateAccountLink = (account: Account): string => {
  return `/journal/a?a=${account._id}`
}
