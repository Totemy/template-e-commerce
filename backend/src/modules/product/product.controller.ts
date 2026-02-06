import { Request, Response } from 'express'
import { ProductService } from './product.service'
import { Material, Product } from '../../database/entities/Product.entity'

const productService = new ProductService()
type ProductResponse = { products: Product[] }
export class ProductController {
    /**
     * GET /api/products
     * get all products with filter
     * Query params: ?categoryId=uuid&isFeatured=true&search=каблучка
     */

    async getAll(req: Request, res: Response) {
        try {
            const filters = {
                categoryId: req.query.categoryId as string,
                isFeatured: req.query.isFeatured === 'true',
                isNewArrival: req.query.isNewArrival === 'true',
            }

            const products = await productService.findAll(filters)
            const productResp: ProductResponse = { products: products }
            res.status(200).json(productResp)
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to fetch products',
            })
        }
    }

    /**
     * GET /api/products/:slug
     */

    async getBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params

            const product = await productService.findBySlug(slug)

            res.status(200).json({
                data: product,
            })
        } catch (error: any) {
            res.status(404).json({
                error: error.message || 'Product not found',
            })
        }
    }

    /**
     * POST /api/admin/products
     * create product
     */

    async create(req: Request, res: Response) {
        try {
            const {
                categoryIds,
                name,
                slug,
                description,
                price,
                weight,
                material,
                compareAtPrice,
                images,
                variants,
            } = req.body

            if (
                !Array.isArray(categoryIds) ||
                categoryIds.length === 0 ||
                !name ||
                !slug ||
                !description ||
                price === undefined ||
                weight === undefined ||
                !material
            ) {
                return res.status(400).json({
                    error: 'Missing required fields',
                })
            }

            if (!Object.values(Material).includes(material)) {
                return res.status(400).json({
                    error: `Invalid material. Must be one of: ${Object.values(Material).join(', ')}`,
                })
            }

            const product = await productService.create({
                categoryIds,
                name,
                slug,
                description,
                price: Number(price),
                weight: Number(weight),
                material,
                compareAtPrice: compareAtPrice
                    ? Number(compareAtPrice)
                    : undefined,
                images,
                variants,
            })

            res.status(201).json({
                message: 'Product created',
                data: product,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Product creation failed',
            })
        }
    }

    /**
     * PUT /api/admin/products/:id
     */
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const updateData = req.body

            if (updateData.price) updateData.price = Number(updateData.price)
            if (updateData.weight) updateData.weight = Number(updateData.weight)
            if (updateData.compareAtPrice) {
                updateData.compareAtPrice = Number(updateData.compareAtPrice)
            }

            const product = await productService.update(id, updateData)

            res.status(200).json({
                message: 'Product updated',
                data: product,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Product update failed',
            })
        }
    }

    /**
     * DELETE /api/admin/products/:id
     */
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            await productService.delete(id)

            res.status(200).json({
                message: 'Product deleted',
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Product deletion failed',
            })
        }
    }

    async addCategories(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { categoryIds } = req.body

            if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
                return res.status(400).json({
                    error: 'categoryIds must be a non-empty array',
                })
            }

            const product = await productService.addCategories(id, categoryIds)

            res.status(200).json({
                message: 'Category added',
                data: product,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to add categories',
            })
        }
    }

    async removeCategory(req: Request, res: Response) {
        try {
            const { id, categoryId } = req.params

            const product = await productService.removeCategory(id, categoryId)

            res.status(200).json({
                message: 'Category removed',
                data: product,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to remove category',
            })
        }
    }
    /**
     * POST /api/admin/products/:id/images
     * add image to product
     */

    async addImage(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { images } = req.body

            if (!Array.isArray(images) || images.length === 0) {
                return res.status(400).json({
                    error: 'Images array is required and must not be empty',
                })
            }

            const savedImages = await productService.addImages(id, images)

            res.status(201).json({
                message: 'Images added',
                data: savedImages,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to add image',
            })
        }
    }

    /**
     * DELETE /api/admin/products/images/:imageId
     */
    async deleteImage(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { imageUrl } = req.body

            if (!imageUrl) {
                return res.status(400).json({
                    error: 'imageUrl is required',
                })
            }

            const product = await productService.deleteImage(id, imageUrl)

            res.status(200).json({
                message: 'Image deleted',
                data: product,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Image deletion failed',
            })
        }
    }

    /**
     * POST /api/admin/products/:id/variants
     * add variant / size to product
     */

    async addVariants(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { variants } = req.body

            if (!Array.isArray(variants) || variants.length === 0) {
                return res.status(400).json({
                    error: 'Variants array is required and must not be empty',
                })
            }
            const savedVariants = await productService.addVariants(id, variants)

            res.status(201).json({
                message: 'Added new variant',
                data: savedVariants,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to add variants',
            })
        }
    }

    async updateVariant(req: Request, res: Response) {
        try {
            const { variantId } = req.params
            const updateData = req.body

            const variant = await productService.updateVariant(
                variantId,
                updateData,
            )

            res.status(200).json({
                message: 'Variant updated',
                data: variant,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Variant update failed',
            })
        }
    }

    /**
     * DELETE /api/admin/products/variants/:variantId
     */
    async deleteVariant(req: Request, res: Response) {
        try {
            const { variantId } = req.params

            await productService.deleteVariant(variantId)
            res.status(200).json({
                message: 'Variant deleted',
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Variant deletion failed',
            })
        }
    }
}
