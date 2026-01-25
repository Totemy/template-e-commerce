import { Request, Response } from 'express'
import { ProductService } from './product.service'
import { error } from 'console'

const productService = new ProductService()

export class ProductController {
    /**
     * GET /api/products
     * get all products with filter
     * Query params: ?categoryId=uuid&isFeatured=true&search=каблучка
     */

    async getAll(req: Request, res: Response) {
        try {
            const filters = {
                categoryId: req.query.categoryId as string | undefined,
                isFeatured: req.query.isFeatured === 'true',
                isNewArrival: req.query.isNewArrival === 'true',
                search: req.query.search as string | undefined,
            }

            const products = await productService.findAll(filters)

            res.status(200).json({
                data: products,
                count: products.length,
            })
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

            const product = await productService.addImages.findBySlug(slug)

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
                categoryId,
                name,
                slug,
                description,
                price,
                weight,
                metal,
                compareAtPrice,
            } = req.body

            if (
                !categoryId ||
                !name ||
                !slug ||
                !description ||
                !price ||
                !weight ||
                !metal
            ) {
                return res.status(400).json({
                    error: 'Missing required fields: categoryId, name, slug, description, price, weight, metal',
                })
            }

            const product = await productService.create({
                categoryId,
                name,
                slug,
                description,
                price: Number(price),
                weight: Number(weight),
                metal,
                compareAtPrice: compareAtPrice
                    ? Number(compareAtPrice)
                    : undefined,
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
            const { imageId } = req.params

            await productService.deleteImage(imageId)

            res.status(200).json({
                message: 'Image deleted',
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
