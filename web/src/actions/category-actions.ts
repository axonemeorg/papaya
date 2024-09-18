'use server'

import { validateRequest } from "@/auth";
import db from "@/database/client";
import { CategoryTable, JournalEntryTable } from "@/database/schemas";
import { eq, cosineDistance, desc, sql, and } from "drizzle-orm";
import { generateEmbedding } from "./embeddings";
import { CreateCategory } from "@/types/post";
import { UpdateCategory } from "@/types/put";
import { revalidatePath } from "next/cache";
import { Category } from "@/types/get";

export const getCategoriesByUserId = async (userId: string): Promise<Category[]> => {
	const response = await db
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
		.where(eq(CategoryTable.userId, userId));
	
	return response as Category[];
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

	// delete result[0].similarity; // Commenting this out due to strict=true type error
	return result[0];
}

export const createCategory = async (category: CreateCategory): Promise<Category> => {
	const { user } = await validateRequest();

	if (!user) {
		throw new Error('Not authorized.');
	}

	const descriptionEmbedding = await generateEmbedding(category.description);

	const response = await db
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

	return response as unknown as Category;
}

export const updateCategory = async (category: UpdateCategory) => {
	const { user } = await validateRequest();

	if (!user) {
		throw new Error('Not authorized.');
	}

	const descriptionEmbedding = await generateEmbedding(category.description);

	const response = await db
		.update(CategoryTable)
		.set({
			label: category.label,
			description: category.description,
			descriptionEmbedding,
			avatarVariant: category.avatarVariant,
			avatarContent: category.avatarContent,
			avatarPrimaryColor: category.avatarPrimaryColor,
			avatarSecondaryColor: category.avatarSecondaryColor,
		})
		.where(
			and(
				eq(CategoryTable.userId, user.id),
				eq(CategoryTable.categoryId, category.categoryId)
			)
		)
		.returning({
			categoryId: CategoryTable.categoryId,
			label: CategoryTable.label,
			description: CategoryTable.description,
			avatarVariant: CategoryTable.avatarVariant,
			avatarContent: CategoryTable.avatarContent,
			avatarPrimaryColor: CategoryTable.avatarPrimaryColor,
			avatarSecondaryColor: CategoryTable.avatarSecondaryColor,
		});

	revalidatePath('/journal');
	return response;
}

export const deleteCategory = async (category: UpdateCategory) => {
	const { user } = await validateRequest();

	if (!user) {
		throw new Error('Not authorized.');
	}

	// Update journal entries to remove references to the category

	await db.update(JournalEntryTable)
		.set({
			categoryId: null,
		})
		.where(
			and(
				eq(JournalEntryTable.userId, user.id),
				eq(JournalEntryTable.categoryId, category.categoryId)
			)
		)

	const response = await  db.delete(CategoryTable)
		.where(
			and(
				eq(CategoryTable.userId, user.id),
				eq(CategoryTable.categoryId, category.categoryId)
			)
		)
		.returning({
			categoryId: CategoryTable.categoryId,
		});

	revalidatePath('/journal');

	return response;
}
