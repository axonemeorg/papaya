import { z, ZodLiteral, ZodObject, ZodRawShape, ZodSchema } from "zod";

export const ModelBase = z.object({
    kind: z.string(),
    _id: z.string(),
})



export const ZiskModel = z.union([
    Category,
    JournalEntry,
])


type ZiskKindLiteral = ZodLiteral<`zisk:${string}`>;

type ShapeWithKind = {
  kind: ZiskKindLiteral;
} & ZodRawShape;

class ModelFactory {
    public static extend<Shape extends ShapeWithKind>(shape: Shape) {
      const schema = z.object(shape);
      type SchemaType = z.infer<typeof schema>;
  
      return class BaseModel {
        public static schema: ZodObject<Shape> = schema;

        public static async make(props: Partial<SchemaType>): Promise<SchemaType> {
            return this.schema.parse(props);
        }
  
        public static parse(props: unknown): SchemaType {
          return this.schema.parse(props);
        }
      };
    }
  }
  
  // --- DOCUMENT FACTORY ---
  
  class DocumentFactory {
    public static extend<Shape extends ShapeWithKind>(shape: Shape) {
      const Base = ModelFactory.extend(shape);
      type SchemaType = z.infer<typeof Base.schema>;
  
      return class DocumentModel extends Base {
  
        public static async create(props: Partial<SchemaType>): Promise<SchemaType> {
          const parsed = await this.make(props);
          return db.create(parsed);
        }
      };
    }
  }


  class CategoryModel extends ModelFactory
    .extend({
        kind: z.literal('zisk:hello'),
        categoryId: z.string(),
        label: z.string(),
    }) {

    static customLogic() {
      // ...
    }
}
