import { http } from '../api/http'
import type { Category } from '../types/category'

export const CategoryService = {
    getAll() {
        return http.get<{ categories: Category[] }>('/categories')
    },
    getById(id: string) {
        return http.get<Category>(`/categories/${id}`)
    },
}
