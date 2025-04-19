import { z } from "zod";
import { ModelFactory, ShapeWithZiskModelKind } from "./ModelFactory";

const db: any = {}

/**
 * A factor class for producing Zisk ORM Document classes.
 */
export class DocumentFactory extends ModelFactory {
	protected static override intrinsicSchemaShape = {
		// Extends ModelFactory intrinsic shape
		...ModelFactory.intrinsicSchemaShape,
		_rev: z.string().optional(),
	};

	/**
	 * Constructs a Document class which implements extensible methods for
	 * instantiating an object instance, as well as persisting it to a database.
	 * 
	 * @param domainSchemaShape The shape of the Domain schema, namely the schema
	 * of interest for the superclass of Model.
	 */
	public static fromSchema<Shape extends ShapeWithZiskModelKind>(domainSchemaShape: Shape) {
		const intrinsicSchema = z.object(DocumentFactory.intrinsicSchemaShape)
		const derivedSchema = intrinsicSchema.extend(domainSchemaShape);

		/**
		 * A class for performing basic static methods pertaining to domain
		 * schema.
		 */
		const Model = ModelFactory.fromSchema(domainSchemaShape);

		/**
		 * Represents the extended type of Document intrinsic schema, which
		 * extends Model intrinsic schema.
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
		 * 
		 * @extends Model
		 */
		class Document extends Model {
			/**
			 * Returns an object containing preset values for all intrinsic
			 * properties.
			 */
			public static override async intrinsics(): Promise<IntrinsicSchemaType> {
				return {
					...(await Model.intrinsics()),
					_rev: undefined,
				}
			}

			public static async create(props: Partial<DerivedSchemaType>): Promise<DerivedSchemaType> {
				const parsed = await this.make(props);
				return db.create(parsed); // replace with real DB call
			}

			public static async find(id: string): Promise<DerivedSchemaType | undefined> {
				const response = await db.find(id);
				return response
			}
		};

		return Document;
	}
}
