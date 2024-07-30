import db from "@/database/client";
import { CategoryTable } from "@/database/schemas";
import { eq } from "drizzle-orm";

export const getCategoriesByUserId = (userId: string) => {
	return db.query.CategoryTable.findMany({
		where: eq(CategoryTable.userId, userId)
	});
}
