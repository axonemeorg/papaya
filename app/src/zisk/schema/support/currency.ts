import { z } from "zod";
import { Figure } from "../models/Figure";

export const Currency = z.enum([
    'USD',
    'CAD',
])
export type Currency = z.output<typeof Currency>

export const FigureEnumeration = z.partialRecord(Currency, Figure)
export type FigureEnumeration = z.output<typeof FigureEnumeration>