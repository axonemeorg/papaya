'use server'

import { CreateCategory } from "@/types/post";
import { UpdateCategory } from "@/types/put";
import { revalidatePath } from "next/cache";
import { Category } from "@/types/get";
import CategoryService from "@/server/services/CategoryService";

export const getAllUserCategories = async (): Promise<Category[]> => {
	const response = await CategoryService.getAllUserCategories();
	return response as Category[];
}

export const findMostSimilarUserCategory = async (memo: string) => {
	return CategoryService.findMostSimilarUserCategory(memo);
}

export const createCategory = async (category: CreateCategory): Promise<Category> => {
	const response = await CategoryService.createCategory(category);

	return response as unknown as Category;
}

export const updateCategory = async (category: UpdateCategory) => {
	const response = await CategoryService.updateCategory(category);

	revalidatePath('/journal');
	return response;
}

export const deleteCategory = async (category: UpdateCategory) => {
	const response = await CategoryService.deleteCategory(category);

	revalidatePath('/journal');
	return response;
}
