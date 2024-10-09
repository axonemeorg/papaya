import { validateRequest } from "@/auth";
import CategoryRepository from "../repositories/CategoryRepository";
import { generateEmbedding } from "@/actions/embeddings";
import { CreateCategory } from "@/types/post";
import { UpdateCategory } from "@/types/put";
import JournalService from "./JournalService";

export default class CategoryService {
    static async getUserCategoryById(categoryId: string) {
        const { user } = await validateRequest();
	
        if (!user) {
            throw new Error('Not authorized.');
        }

        return CategoryRepository.getCategoryByIdAndUserId(categoryId, user.id);
    }

    static async getAllUserCategories() {
        const { user } = await validateRequest();
	
        if (!user) {
            throw new Error('Not authorized.');
        }

        return CategoryRepository.getAllCategoriesByUserId(user.id);
    }

    static async findMostSimilarUserCategory(memo: string) {
        const { user } = await validateRequest();

        if (!user) {
            throw new Error('Not authorized.');
        }

        const memoEmbedding = await generateEmbedding(memo);

        const result = await CategoryRepository.findMostSimilarUserCategoryByUserId(user.id, memoEmbedding);

        // delete result[0].similarity; // Commenting this out due to strict=true type error
        return result[0];
    }

    static async createCategory(category: CreateCategory) {
        const { user } = await validateRequest();

        if (!user) {
            throw new Error('Not authorized.');
        }

        const descriptionEmbedding = await generateEmbedding(category.description);

        return CategoryRepository.insertCategory({
            userId: user.id,
            label: category.label,
            description: category.description,
            descriptionEmbedding,
            avatarVariant: category.avatarVariant,
            avatarContent: category.avatarContent,
            avatarPrimaryColor: category.avatarPrimaryColor,
            avatarSecondaryColor: category.avatarSecondaryColor,
        });
    }

    static async updateCategory(category: UpdateCategory) {
        const { user } = await validateRequest();

        if (!user) {
            throw new Error('Not authorized.');
        }
    
        const descriptionEmbedding = await generateEmbedding(category.description);
    
        return CategoryRepository.updateCategory({
            userId: user.id,
            categoryId: category.categoryId,
            label: category.label,
            description: category.description,
            descriptionEmbedding,
            avatarVariant: category.avatarVariant,
            avatarContent: category.avatarContent,
            avatarPrimaryColor: category.avatarPrimaryColor,
            avatarSecondaryColor: category.avatarSecondaryColor,
        });
    }

    static async deleteCategory(category: UpdateCategory) {
        const { user } = await validateRequest();

        if (!user) {
            throw new Error('Not authorized.');
        }
    
        // Update journal entries to remove references to the category
        await JournalService.removeCategoryFromJournalEntries(category.categoryId);

        // Delete the category
        return CategoryRepository.deleteCategoryByCategoryIdAndUserId(category.categoryId, user.id);
    }
}
