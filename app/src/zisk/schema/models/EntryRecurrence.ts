import { ModelSchema } from "@/schema/support/orm/Model";
import { RecurringCadence } from "@/schema/support/recurrence";
import { z } from "zod";

export const EntryRecurrency = ModelSchema.from(
  {
      kind: z.literal('zisk:recurrence')
  },
  z.interface({
    /**
     * Encodes the cadence of the recurrence, e.g. every four weeks,
     * every month, etc. If this value is undefined, then the it
     * will inherit the cadence of the last recurrence.
     */
    cadence: RecurringCadence,

    ends: z.union([
        z.interface({
            onDate: z.string(),
        }),
        z.interface({
            afterNumOccurrences: z.number()
        })
    ]).nullable(),

    'exceptions?': z.interface({
        onDates: z.array(z.string()).optional(),
        afterDate: z.string().optional(),
    }).optional(),
  })
)
export type EntryRecurrency = z.output<typeof EntryRecurrency>;
