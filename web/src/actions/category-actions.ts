'use server'

import { validateRequest } from "@/auth";
import db from "@/database/client";
import { CategoryTable } from "@/database/schemas";
import { eq, cosineDistance, desc, sql } from "drizzle-orm";
import { generateEmbedding } from "./embeddings";
import { CreateCategory } from "@/types/post";

export const getCategoriesByUserId = async (userId: string) => {
	return db
		.select({
			categoryId: CategoryTable.categoryId,
			label: CategoryTable.label,
			description: CategoryTable.description,
			avatarVariant: CategoryTable.avatarVariant,
			avatarContent: CategoryTable.avatarContent,
			avatarPrimaryColor: CategoryTable.avatarPrimaryColor,
			avatarSecondaryColor: CategoryTable.avatarSecondaryColor,
		})
		.from(CategoryTable)
		.where(eq(CategoryTable.userId, userId))
}

export const findMostSimilarCategory = async (memo: string) => {
	const { user } = await validateRequest();

	if (!user) {
		throw new Error('Not authorized.');
    }

	const memoEmbedding = await generateEmbedding(memo);

	const similarity = sql<number>`1 - (${cosineDistance(CategoryTable.descriptionEmbedding, memoEmbedding)})`;

	const result = await db
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
		.where(eq(CategoryTable.userId, user.id))
		.orderBy((t) => desc(t.similarity))
		.limit(1);

	delete result[0].similarity;
	return result[0];
}

export const createCategory = async (category: CreateCategory) => {
	console.log('create category action:', category);
	const { user } = await validateRequest();

	if (!user) {
		throw new Error('Not authorized.');
	}

	const descriptionEmbedding = await generateEmbedding(category.description);

	return db
		.insert(CategoryTable)
		.values({
			userId: user.id,
			label: category.label,
			description: category.description,
			descriptionEmbedding,
			avatarVariant: category.avatarVariant,
			avatarContent: category.avatarContent,
			avatarPrimaryColor: category.avatarPrimaryColor,
			avatarSecondaryColor: category.avatarSecondaryColor,
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
