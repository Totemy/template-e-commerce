import { http } from '../api/http'
import type { Product } from '../types/product'

export const ProductService = {
    getAll() {
        return http.get<{ products: Product[] }>('/products')
    },

    getById(id: string) {
        return http.get<Product>(`/products/${id}`)
    },
}
