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
  private static intrinsicSchemaShape: ZodRawShape = {
    _id: z.string(),
    createdAt: z.string(),
  }

  public static extend<Shape extends ShapeWithKind>(domainSchemaShape: Shape) {
    const intrinsicSchema = z.object(ModelFactory.intrinsicSchemaShape)
    const derivedSchema = intrinsicSchema.extend(domainSchemaShape);

    type DerivedSchemaType = z.infer<typeof derivedSchema>;
    type IntrinsicSchemaType = z.infer<typeof intrinsicSchema>


    return class BaseModel {
      public static schema: ZodObject<DerivedSchemaType> = derivedSchema;

      public static async intrinsics(): Promise<IntrinsicSchemaType> {
        return {
          _id: 'some-randomly-generated-id',
          createdAt: new Date().toISOString(),
        }
      }

      public static async make(props: Partial<DerivedSchemaType>): Promise<DerivedSchemaType> {
        return {
          ...(await this.intrinsics()),
          ...props,
        }
      }

      public static parse(props: unknown): DerivedSchemaType {
        return this.schema.parse(props);
      }
    };
  }
}

// --- DOCUMENT FACTORY ---

class DocumentFactory {
  public static extend<Shape extends ShapeWithKind>(domainSchemaShape: Shape) {
    const Base = ModelFactory.extend(domainSchemaShape);

    type SchemaType = z.infer<typeof Base.schema>;

    return class DocumentModel extends Base {
      public static async create(props: Partial<SchemaType>): Promise<SchemaType> {
        const parsed = await this.make(props);
        return db.create(parsed); // replace with real DB call
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
