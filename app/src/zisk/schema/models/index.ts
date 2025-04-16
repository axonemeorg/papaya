import { z, ZodSchema } from "zod";

export const ModelBase = z.object({
    kind: z.string(),
    _id: z.string(),
})



export const ZiskModel = z.union([
    Category,
    JournalEntry,
])




class ModelFactory {
    private static async create<M>(props: M): Promise<M> {
        const result: M = await db.create(props)
        return result
    }

    public static extend<T extends ZodSchema>(schema: T) {
        return class ExtendedModel {
            public static async make(props: Partial<T>): Promise<T> {
                return Promise.resolve<T>({
                    ...props,
                })
            }

            public static async create(props: Partial<T>): Promise<any> {
                return ModelFactory.create<T>(await ExtendedModel.make(props));
            }
        }
    }
}

const CategoryModel = ModelFactory.extend({
    kind: z.literal('zisk:category'),
    categoryId: z.string(),
    label: z.string(),
});