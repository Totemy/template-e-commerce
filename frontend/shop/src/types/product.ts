import type { Category } from './category'

export interface ProductImage {
    url: string
    altText?: string
}

export interface ProductVariant {
    id: string
    name: string
    priceAdjustment: string
    stockQuantity: number
}

export type Material =
    | 'silver_925'
    | 'gold_585'
    | 'gold_750'
    | 'platinum'
    | 'steel'

export interface Product {
    id: string
    name: string
    //slug: string
    description?: string

    price: number
    //compareAtPrice: number
    weight: number

    material: Material

    images: ProductImage[]
    categories: Category[]
}
