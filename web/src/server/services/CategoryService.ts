import { validateRequest } from "@/auth";
import CategoryRepository from "../repositories/CategoryRepository";
import { generateEmbedding } from "@/actions/embeddings";
import { CreateCategory } from "@/types/post";

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
}
