import { Category, ItemAvatar } from "@/types/get";
import { CreateCategory } from "@/types/post";
import { UpdateCategory } from "@/types/put";
import { create } from "zustand";

interface CategoriesStore {
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    addCategory: (category: Category) => void;
    updateCategory: (category: UpdateCategory) => void;
  }

export const useCategoryStore = create<CategoriesStore>((set) => ({
    categories: [],
    addCategory: (category: Category) => set((state) => ({ categories: [...state.categories, category] })),
    setCategories: (categories: Category[]) => set(() => ({ categories })),
    updateCategory: (category: UpdateCategory) => set((state) => {
        return {
            categories: [...state.categories].map((stateCategory) => {
                if (stateCategory.categoryId ===  category.categoryId) {
                    return category;
                }
                return stateCategory
            })
        }
    })
}));
