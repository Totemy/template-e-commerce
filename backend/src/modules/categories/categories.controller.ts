import { Request, Response } from 'express'
import { CategoriesService } from './categories.service'
import { error } from 'console'

const categoriesService = new CategoriesService()

export class CategoriesController {
    /**
     * GET /api/categories
     */
    async getAll(req: Request, res: Response) {
        try {
            const categories = await categoriesService.findAll()

            res.status(200).json({
                data: categories,
            })
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to fatch categories',
            })
        }
    }

    /**
     * GET /api/categories/:slug
     */
    async getBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params

            const category = await categoriesService.findBySlug(slug)

            res.status(200).json({
                data: category,
            })
        } catch (error: any) {
            res.status(404).json({
                error: error.message || 'Category not found',
            })
        }
    }

    /**
     * POST /api/admin/categories
     */
    async create(req: Request, res: Response) {
        try {
            const { name, slug, description, imageUrl, displayOrder } = req.body

            if (!name || !slug) {
                return res.status(400).json({
                    error: 'Name and slug are required',
                })
            }

            const category = await categoriesService.create({
                name,
                slug,
                description,
                imageUrl,
                displayOrder,
            })

            res.status(201).json({
                message: 'Category created',
                data: category,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Category creation failed',
            })
        }
    }

    /**
     * PUT /api/admin/categories/:id
     */
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const updateData = req.body

            const category = await categoriesService.update(id, updateData)

            res.status(200).json({
                message: 'Category updated',
                data: category,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Category update failed',
            })
        }
    }

    /**
     * DELETE /api/admin/categories/:id
     */
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            await categoriesService.delete(id)

            res.status(200).json({
                message: 'Category deleted',
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'category delete failed',
            })
        }
    }

    /**
     * POST /api/admin/categories/reorder
     * change order list position
     */
    async reorder(req: Request, res: Response) {
        try {
            const { categoryOrders } = req.body

            if (!Array.isArray(categoryOrders)) {
                return res.status(400).json({
                    error: 'categoryOrders must be an array',
                })
            }

            const categories = await categoriesService.reorder(categoryOrders)

            res.status(200).json({
                message: 'Categories reorder',
                data: categories,
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Reorder failed',
            })
        }
    }
}
