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

export interface Product {
    id: string
    name: string
    slug: string
    description?: string

    price: number
    compareAtPrice: number
    weight: number

    images: ProductImage[]
}
