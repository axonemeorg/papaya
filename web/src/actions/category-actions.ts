'use server'

import { validateRequest } from "@/auth";
import db from "@/database/client";
import { CategoryTable } from "@/database/schemas";
import { eq, cosineDistance, desc, sql } from "drizzle-orm";
import { generateEmbedding } from "./embeddings";

export const getCategoriesByUserId = async (userId: string) => {
	return db.query.CategoryTable.findMany({
		where: eq(CategoryTable.userId, userId)
	});
}

export const findMostSimilarCategory = async (memo: string) => {
	const { user } = await validateRequest();

	if (!user) {
		throw new Error('Not authorized.');
    }

	const memoEmbedding = await generateEmbedding(memo);

	const similarity = sql<number>`1 - (${cosineDistance(CategoryTable.labelEmbedding, memoEmbedding)})`;

	const result = await db
		.select({
			categoryId: CategoryTable.categoryId,
			label: CategoryTable.label,
			similarity,
		})
		.from(CategoryTable)
		.where(eq(CategoryTable.userId, user.id))
		.orderBy((t) => desc(t.similarity))
		.limit(1);

	delete result[0].similarity;
	return result[0];
}
