import db from "@/database/client";
import { CategoryTable } from "@/database/schemas";
import { and, eq } from "drizzle-orm";

export default class CateogryRepository {
    static async getCategoryByIdAndUserId(categoryId: string, userId: string) {
        return db.query.CategoryTable.findFirst({
            where: and(
                eq(CategoryTable.userId, userId),
                eq(CategoryTable.categoryId, categoryId)
            )
        })
    }
}
