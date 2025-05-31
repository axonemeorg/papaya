import { z } from 'zod/v4'
import { Figure } from '../models/Figure'
import { Currency } from './currency'

export const FigureEnumeration = z.partialRecord(Currency, Figure)
export type FigureEnumeration = z.output<typeof FigureEnumeration>
