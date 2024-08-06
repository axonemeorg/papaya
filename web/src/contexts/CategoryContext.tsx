import { Category } from "@/types/get";
import { createContext } from "react";

export interface CategoryContext {
    categories: Category[];
}

export const CategoryContext = createContext<CategoryContext>({
    categories: []
});
