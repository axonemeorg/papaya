import { z, ZodRawShape, ZodSchema } from "zod";

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
      return db.create(props);
    }
  
    public static extend<Shape extends ZodRawShape>(shape: Shape) {
      const schema = z.object(shape);
      type SchemaType = z.infer<typeof schema>;
  
      return class ExtendedModel {
        private static schema: typeof schema = schema;
  
        public static async make(props: Partial<SchemaType>): Promise<SchemaType> {
          return schema.parse(props);
        }
  
        public static async create(props: Partial<SchemaType>): Promise<SchemaType> {
          const parsed = await this.make(props);
          return ModelFactory.create(parsed);
        }
  
        public static validate(props: unknown): SchemaType {
          return this.schema.parse(props);
        }
      };
    }
  }

  class CategoryModel extends ModelFactory
    .extend({
        kind: z.literal('zisk:category'),
        categoryId: z.string(),
        label: z.string(),
    }) {

    static customLogic() {
      // ...
    }
}
