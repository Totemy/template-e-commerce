import { AppDataSource } from '../../database/data-source'
import { Product } from '../../database/entities/Product.entity'
import { ProductImage } from '../../database/entities/ProductImage.entity'
import { ProductVariant } from '../../database/entities/ProductVariant.entity'

export class ProductService {
    private productRepo = AppDataSource.getRepository(Product)
    private imageRepo = AppDataSource.getRepository(ProductImage)
    private variantRepo = AppDataSource.getRepository(ProductVariant)

    async findAll(filters?: {
        categoryId?: string
        isFeatured?: boolean
        isNewArrival?: boolean
    }) {
        const query = this.productRepo
            .createQueryBuilder('product')
            .where('product.isAvailable = :isAvailable', { isAvailable: true })

        if (filters?.categoryId) {
            query.andWhere('product.categoryId = :categoryId', {
                categoryId: filters.categoryId,
            })
        }
        if (filters?.isFeatured) {
            query.andWhere('product.isFeatured = :isFeatured', {
                isFeatured: true,
            })
        }
        if (filters?.isNewArrival) {
            query.andWhere('product.isNewArrival = :isNewArrival', {
                isNewArrival: true,
            })
        }

        const product = await query.getMany()

        //upload images and variants
        const productIds = product.map((p) => p.id)

        const images = await this.imageRepo
            .createQueryBuilder('image')
            .where('image.productId IN (:...productIds)', { productIds })
            .orderBy('image.displayOrder', 'ASC')
            .getMany()
        const variants = await this.variantRepo
            .createQueryBuilder('variant')
            .where('variant.productId IN (:...productIds)', { productIds })
            .getMany()

        //all in one
        return product.map((product) => ({
            ...product,
            images: images.filter((img) => img.productId === product.id),
            variants: variants.filter((v) => v.productId === product.id),
        }))
    }

    async findBySlug(slug: string) {
        const product = await this.productRepo.findOne({ where: { slug } })

        if (!product) {
            throw new Error('Product not found')
        }

        const images = await this.imageRepo.find({
            where: { productId: product.id },
            order: { displayOrder: 'ASC' },
        })

        const variants = await this.variantRepo.find({
            where: { productId: product.id },
        })

        return {
            ...product,
            images,
            variants,
        }
    }
    async create(data: {
        categoryId: string
        name: string
        slug: string
        description: string
        price: number
        weight: number
        metal: string
    }) {
        const product = this.productRepo.create({
            ...data,
            sku: `SJ-${Date.now()}`,
        })

        return await this.productRepo.save(product)
    }

    async addImages(
        productId: string,
        images: { url: string; altText?: string }[],
    ) {
        const imageEntities = images.map((img, index) =>
            this.imageRepo.create({
                productId,
                url: img.url,
                altText: img.altText,
                displayOrder: index,
                isPrimary: index === 0,
            }),
        )
        return await this.imageRepo.save(imageEntities)
    }

    async addVariants(
        productId: string,
        variants: {
            name: string
            stockQuantity: number
        }[],
    ) {
        const variantEntities = variants.map((v) =>
            this.variantRepo.create({
                productId,
                name: v.name,
                sku: `${productId}-${v.name}`,
                stockQuantity: v.stockQuantity,
            }),
        )
        return await this.variantRepo.save(variantEntities)
    }
}
