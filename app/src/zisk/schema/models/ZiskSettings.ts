export const ZiskSettings = z.object({
	appearance: z.object({
		// theme: z.union([z.literal('LIGHT'), z.literal('DARK'), z.literal('SYSTEM')]),
		// animations: z.union([z.literal('NORMAL'), z.literal('FAST'), z.literal('OFF')]),
		menuExpanded: z.boolean(),
	}),
	server: ZiskServer,
	syncingStrategy: SyncingStrategy,
})

export type ZiskSettings = z.output<typeof ZiskSettings>
