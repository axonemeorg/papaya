import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./actions";
import { Category } from "@/types/schema";


export const fetchCategoriesQuery = useQuery<Record<Category['_id'], Category>>({
    queryKey: ['categories'],
    initialData: {},
    queryFn: async (): Promise<Record<Category['_id'], Category>> => {
        const categories = await getCategories();
        return Object.fromEntries((categories.docs as Category[])
            .map(category => [category._id, category]));
    },
});
