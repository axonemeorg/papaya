import { z, ZodLiteral, ZodObject, ZodRawShape } from "zod";

/**
 * Type representing the string literal attriute used to disambiguate Zisk
 * documents.
 */
export type ZiskModelKind = ZodLiteral<`zisk:${string}`>;

/**
 * Represents the schema shape for which all subclasses for BaseModel must
 * specify.
 */
export type ZiskModelRequiredShape = {
	kind: ZiskModelKind;
} & ZodRawShape;

/**
 * A factor class for producing Zisk ORM BaseModel classes.
 */
export class ModelFactory {
	protected static intrinsicSchemaShape = {
		_id: z.string(),
		createdAt: z.string(),
	}

	/**
	 * Constructs a BaseModal class which implements extensible methods for
	 * instantiating an object instance.
	 * 
	 * @param domainSchemaShape The shape of the Domain schema, namely the schema
	 * of interest for the superclass of BaseModel.
	 */
	public static extend<Shape extends ZiskModelRequiredShape>(domainSchemaShape: Shape) {
		const intrinsicSchema = z.object(ModelFactory.intrinsicSchemaShape)
		const derivedSchema = intrinsicSchema.extend(domainSchemaShape);

		/**
		 * Represents the type of BaseModel intrinsic schema
		 */
		type IntrinsicSchemaType = z.infer<typeof intrinsicSchema>

		/**
		 * Represents the type of the derived schema, where the derived schema
		 * is the union of the intrinsic schema and the domain schema.
		 */
		type DerivedSchemaType = z.infer<typeof derivedSchema>;

		/**
		 * A class for performing basic static methods pertaining to domain
		 * schema.
		 */
		class BaseModel {
			private static schema: ZodObject<DerivedSchemaType> = derivedSchema;

			/**
			 * Returns an object containing preset values for all intrinsic
			 * properties.
			 */
			public static async intrinsics(): Promise<IntrinsicSchemaType> {
				return {
					_id: 'some-randomly-generated-model-id',
					createdAt: new Date().toISOString(),
				}
			}

			/**
			 * Returns an instance of the model, including preset values for
			 * intrinsic properties, without validating or parsing the
			 * object.
			 */
			public static async make(props: Partial<DerivedSchemaType>): Promise<DerivedSchemaType> {
				return {
					...(await this.intrinsics()),
					...props,
				}
			}

			/**
			 * Parses an unknown object using the derived schema belonging to the
			 * model.
			 */
			public static parse(props: unknown): DerivedSchemaType {
				return this.schema.parse(props);
			}
		};

		return BaseModel;
	}
}
