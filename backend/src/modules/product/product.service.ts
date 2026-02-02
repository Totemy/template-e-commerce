import { AppDataSource } from '../../database/data-source'
import { Product, Material } from '../../database/entities/Product.entity'
import { ProductVariant } from '../../database/entities/ProductVariant.entity'
import { Category } from '../../database/entities/Category.entity'
import { In } from 'typeorm'
import { AtLeastOne } from '../../common/types/helpers'

export class ProductService {
    private productRepo = AppDataSource.getRepository(Product)
    private variantRepo = AppDataSource.getRepository(ProductVariant)
    private categoryRepo = AppDataSource.getRepository(Category)

    async findAll(filters?: {
        categoryId?: string
        isFeatured?: boolean
        isNewArrival?: boolean
    }) {
        const where: any = { isAvailable: true }

        if (filters?.isFeatured) where.isFeatured = true
        if (filters?.isNewArrival) where.isNewArrival = true
        if (filters?.categoryId) where.categories = { id: filters.categoryId }

        return this.productRepo.find({
            relations: { categories: true, variants: true },
            where,
            order: { createdAt: 'DESC' },
        })
    }

    async findBySlug(slug: string) {
        return this.findOne({
            slug: slug,
        })
    }

    async findById(id: string) {
        return this.findOne({
            id: id,
        })
    }
    async findOne(filters: AtLeastOne<{ id?: string; slug?: string }>) {
        const product = await this.productRepo.findOne({
            where: filters,
        })
        if (!product) {
            throw new Error('Product not found')
        }
        return product
    }
    async create(data: {
        categoryIds: string[]
        name: string
        slug: string
        description: string
        price: number
        weight: number
        material: Material
        compareAtPrice?: number
        images?: Array<{ url: string; altText?: string }>
        variants?: Array<{
            name: string
            stockQuantity: number
            priceAdjustment?: number
        }>
    }) {
        const existing = await this.productRepo.findOne({
            where: { slug: data.slug },
        })
        if (existing) {
            throw new Error('Product with this slug already exists')
        }

        const categories = await this.categoryRepo.findBy({
            id: In(data.categoryIds),
        })

        const product = this.productRepo.create({
            name: data.name,
            slug: data.slug,
            description: data.description,
            price: data.price,
            weight: data.weight,
            material: data.material,
            compareAtPrice: data.compareAtPrice,
            images: data.images || [],
            categories,
        })

        const savedProduct = await this.productRepo.save(product)

        if (data.variants && data.variants.length > 0) {
            const variants = data.variants.map((v) =>
                this.variantRepo.create({
                    productId: savedProduct.id,
                    name: v.name,
                    stockQuantity: v.stockQuantity,
                    priceAdjustment: v.priceAdjustment || 0,
                }),
            )
            await this.variantRepo.save(variants)
        }

        return await this.findById(savedProduct.id)
    }

    async update(
        id: string,
        data: Partial<Product> & { categoryIds?: string[] },
    ) {
        const product = await this.findById(id)

        if (!product) {
            throw new Error('Product not found')
        }

        if (data.slug && data.slug !== product.slug) {
            const existing = await this.productRepo.findOne({
                where: { slug: data.slug },
            })

            if (existing && existing.id !== id) {
                throw new Error('Product with this slug already exists')
            }
        }

        if (data.categoryIds) {
            const categories = await this.categoryRepo.findBy({
                id: In(data.categoryIds),
            })
            product.categories = categories
            delete data.categoryIds
        }

        Object.assign(product, data)

        return await this.productRepo.save(product)
    }

    async delete(id: string) {
        await this.productRepo.delete(id)
    }

    async addCategories(productId: string, categoryIds: string[]) {
        const product = await this.findById(productId)
        const newCategories = await this.categoryRepo.findBy({
            id: In(categoryIds),
        })

        const existingIds = product.categories.map((c) => c.id)
        const uniqueCategories = newCategories.filter(
            (c) => !existingIds.includes(c.id),
        )

        product.categories = [...product.categories, ...uniqueCategories]
        return await this.productRepo.save(product)
    }

    async removeCategory(productId: string, categoryId: string) {
        const product = await this.findById(productId)
        product.categories = product.categories.filter(
            (cat) => cat.id !== categoryId,
        )

        return await this.productRepo.save(product)
    }

    async addImages(
        productId: string,
        images: Array<{ url: string; altText?: string }>,
    ) {
        const product = await this.findById(productId)
        product.images.push(...images)
        return await this.productRepo.save(product)
    }

    async deleteImage(productId: string, imageUrl: string) {
        const product = await this.findById(productId)
        product.images = product.images.filter((img) => img.url !== imageUrl)
        return await this.productRepo.save(product)
    }
    async addVariants(
        productId: string,
        variants: Array<{
            name: string
            stockQuantity: number
            priceAdjustment?: number
        }>,
    ) {
        const product = await this.productRepo.findOne({
            where: { id: productId },
        })
        if (!product) {
            throw new Error('Product not found')
        }

        const variantEntities = variants.map((v) =>
            this.variantRepo.create({
                productId,
                name: v.name,
                stockQuantity: v.stockQuantity,
                priceAdjustment: v.priceAdjustment || 0,
            }),
        )
        return await this.variantRepo.save(variantEntities)
    }

    async updateVariant(
        variantId: string,
        data: Partial<{
            name: string
            stockQuantity: number
            priceAdjustment: number
            isAvailable: boolean
        }>,
    ) {
        const variant = await this.variantRepo.findOne({
            where: { id: variantId },
        })
        if (!variant) {
            throw new Error('Variant not found')
        }

        Object.assign(variant, data)
        return await this.variantRepo.save(variant)
    }

    async deleteVariant(variantId: string) {
        const variant = await this.variantRepo.findOne({
            where: { id: variantId },
        })
        if (!variant) {
            throw new Error('Variant not found')
        }

        await this.variantRepo.delete(variantId)
    }
}
