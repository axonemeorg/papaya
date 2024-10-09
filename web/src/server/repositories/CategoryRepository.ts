import db from "@/database/client";
import { CategoryTable } from "@/database/schemas";
import { eq, cosineDistance, desc, sql, and, InferInsertModel } from "drizzle-orm";

export default class CategoryRepository {
    static async getCategoryByIdAndUserId(categoryId: string, userId: string) {
        return db.query.CategoryTable.findFirst({
            where: and(
                eq(CategoryTable.userId, userId),
                eq(CategoryTable.categoryId, categoryId)
            )
        })
    }

    static async getAllCategoriesByUserId(userId: string) {
        return db.query.CategoryTable.findMany({
            where: eq(CategoryTable.userId, userId)
        })
    }

    static async findMostSimilarUserCategoryByUserId(userId: string, memoEmbedding: number[]) {
        const similarity = sql<number>`1 - (${cosineDistance(CategoryTable.descriptionEmbedding, memoEmbedding)})`;

        return db
            .select({
                categoryId: CategoryTable.categoryId,
                label: CategoryTable.label,
                description: CategoryTable.description,
                similarity,
                avatarVariant: CategoryTable.avatarVariant,
                avatarContent: CategoryTable.avatarContent,
                avatarPrimaryColor: CategoryTable.avatarPrimaryColor,
                avatarSecondaryColor: CategoryTable.avatarSecondaryColor,
            })
            .from(CategoryTable)
            .where(eq(CategoryTable.userId, userId))
            .orderBy((t) => desc(t.similarity))
            .limit(1);
    }

    static async insertCategory(values: InferInsertModel<typeof CategoryTable>) {
        return await db
            .insert(CategoryTable)
            .values({
                userId: values.userId,
                label: values.label,
                description: values.description,
                descriptionEmbedding: values.descriptionEmbedding,
                avatarVariant: values.avatarVariant,
                avatarContent: values.avatarContent,
                avatarPrimaryColor: values.avatarPrimaryColor,
                avatarSecondaryColor: values.avatarSecondaryColor,
            })
            .returning({
                categoryId: CategoryTable.categoryId,
                label: CategoryTable.label,
                description: CategoryTable.description,
                avatarVariant: CategoryTable.avatarVariant,
                avatarContent: CategoryTable.avatarContent,
                avatarPrimaryColor: CategoryTable.avatarPrimaryColor,
                avatarSecondaryColor: CategoryTable.avatarSecondaryColor,
            });
    }
}
