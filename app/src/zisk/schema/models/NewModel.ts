import z from 'zod';

type KindTemplate = `zisk:${string}`;

type KindShape<K extends KindTemplate> = {
    kind: z.ZodLiteral<K>
}

type Optional<S extends z.ZodRawShape> = {
    [K in keyof S]: z.ZodOptional<S[K]>;
};

const DocumentShape = {
    _id: z.string(),
    _rev: z.string().optional(),
    _deleted: z.boolean().optional(),
}
type DocumentShape = typeof DocumentShape;

const DocumentFactory = <
    K extends KindTemplate,
    Intrinsic extends z.ZodRawShape,
    Derived extends z.ZodRawShape,
>(
    [intrinsic, derived]: [
        KindShape<K> & Intrinsic,
        Derived
    ]
): [
    z.ZodObject<
        & KindShape<K>
        & Intrinsic
        & Optional<DocumentShape>
        & Optional<Derived>
    >,
    z.ZodObject<
        & KindShape<K>
        & Intrinsic
        & DocumentShape
        & Derived
    >
] => {
    // Convert DocumentShape to Optional<DocumentShape>
    const optionalDocShape: Optional<DocumentShape> = Object.fromEntries(
        Object.entries(DocumentShape).map(([key, schema]) => [key, z.optional(schema)])
    ) as Optional<DocumentShape>;

    // Convert derived to Optional<Derived>
    const optionalDerived: Optional<Derived> = Object.fromEntries(
        Object.entries(derived).map(([key, schema]) => [key, z.optional(schema)])
    ) as Optional<Derived>;

    // Combine all schemas
    const intrinsicOutput = z.object({
        ...intrinsic,
        ...optionalDocShape,
        ...optionalDerived,
    }) as z.ZodObject<
        & KindShape<K>
        & Intrinsic
        & Optional<DocumentShape>
        & Optional<Derived>
    >;

    const derivedOutput = z.object({
        ...intrinsic,
        ...DocumentShape,
        ...derived,
    }) as z.ZodObject<
        & KindShape<K>
        & Intrinsic
        & DocumentShape
        & Derived
    >;

    return [
        intrinsicOutput,
        derivedOutput,
    ];
}

const [CreateUser, _User] = DocumentFactory([
    {
        kind: z.literal('zisk:user'),
        name: z.string(),
        bio: z.string(),
    },
    {
        createdAt: z.string(),
    }
]);

const User = _User.extend({
    get friends() {
        return z.array(User);
    }
});

type CreateUser = z.infer<typeof CreateUser>;
type User = z.infer<typeof User>;

// Example usage
const createUserExample: CreateUser = {
    kind: 'zisk:user',
    name: 'John Doe',
    bio: 'Software developer',
    // Optional fields
    // createdAt: '2023-01-01T00:00:00Z',
    // _id: '123',
};

const userExample: User = {
    kind: 'zisk:user',
    name: 'John Doe',
    bio: 'Software developer',
    createdAt: '2023-01-01T00:00:00Z',
    _id: '123',
    // _rev and _deleted are optional
};

/**
 * ModelFactory is a simplified version of DocumentFactory that doesn't include DocumentShape.
 * It creates two Zod objects:
 * 1. A "create" schema where derived fields are optional
 * 2. A "complete" schema where all fields are required (except those explicitly marked optional)
 */
const ModelFactory = <
    K extends KindTemplate,
    Intrinsic extends z.ZodRawShape,
    Derived extends z.ZodRawShape,
>(
    [intrinsic, derived]: [
        KindShape<K> & Intrinsic,
        Derived
    ]
): [
    z.ZodObject<
        & KindShape<K>
        & Intrinsic
        & Optional<Derived>
    >,
    z.ZodObject<
        & KindShape<K>
        & Intrinsic
        & Derived
    >
] => {
    // Convert derived to Optional<Derived>
    const optionalDerived: Optional<Derived> = Object.fromEntries(
        Object.entries(derived).map(([key, schema]) => [key, z.optional(schema)])
    ) as Optional<Derived>;

    // Combine schemas
    const createSchema = z.object({
        ...intrinsic,
        ...optionalDerived,
    }) as z.ZodObject<
        & KindShape<K>
        & Intrinsic
        & Optional<Derived>
    >;

    const completeSchema = z.object({
        ...intrinsic,
        ...derived,
    }) as z.ZodObject<
        & KindShape<K>
        & Intrinsic
        & Derived
    >;

    return [
        createSchema,
        completeSchema,
    ];
}

// Example usage
const [CreateProduct, Product] = ModelFactory([
    {
        kind: z.literal('zisk:product'),
        name: z.string(),
        description: z.string(),
    },
    {
        ...{ _id: z.string() },
        price: z.number(),
        stock: z.number(),
        category: z.string(),
    }
]);

type CreateProduct = z.infer<typeof CreateProduct>;
type Product = z.infer<typeof Product>;

// Example objects
const createProductExample: CreateProduct = {
    kind: 'zisk:product',
    name: 'Laptop',
    description: 'High-performance laptop',
    // These are optional
    price: 999.99,

    // stock and category are omitted
};

const productExample: Product = {
    kind: 'zisk:product',
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    stock: 10,
    category: 'Electronics'
};