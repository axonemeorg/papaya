import { z } from "zod";
import { Figure } from "../models/Figure";

export const Currency = z.enum([
    'USD',
    'CAD',
])
export type Currency = z.output<typeof Currency>
