import { validateRequest } from "@/auth";
import CateogryRepository from "../repositories/CategoryRepository";

export default class CategoryService {
    static async getUserCategoryById(categoryId: string) {
        const { user } = await validateRequest();
	
        if (!user) {
            throw new Error('Not authorized.');
        }

        return CateogryRepository.getCategoryByIdAndUserId(categoryId, user.id);
    }

    static async getAllUserCategories() {
        const { user } = await validateRequest();
	
        if (!user) {
            throw new Error('Not authorized.');
        }

        return CateogryRepository.getAllCategoriesByUserId(user.id);
    }
}
