import { AppDataSource } from '../../database/data-source'
import { Category } from '../../database/entities/Category.entity'

export class CategoriesService {
    private categoryRepo = AppDataSource.getRepository(Category)

    async findAll() {
        return await this.categoryRepo.find({
            where: { isActive: true },
            order: {
                displayOrder: 'ASC',
                name: 'ASC',
            },
        })
    }

    async findAllForAdmin() {
        return await this.categoryRepo.find({
            order: {
                displayOrder: 'ASC',
                name: 'ASC',
            },
        })
    }

    async findBySlug(slug: string) {
        const category = await this.categoryRepo.findOne({
            where: { slug, isActive: true },
        })

        if (!category) {
            throw new Error('Category not found')
        }

        return category
    }

    async create(data: {
        name: string
        slug: string
        description?: string
        imageUrl?: string
        displayOrder?: number
    }) {
        const existing = await this.categoryRepo.findOne({
            where: { slug: data.slug },
        })

        if (existing) {
            throw new Error('Category with this slug already exists')
        }

        const category = this.categoryRepo.create(data)
        return await this.categoryRepo.save(category)
    }

    async update(
        id: string,
        data: Partial<{
            name: string
            slug: string
            description: string
            imageUrl: string
            displayOrder: number
            isActive: boolean
        }>,
    ) {
        const category = await this.categoryRepo.findOne({ where: { id } })

        if (!category) {
            throw new Error('Category not found')
        }

        if (data.slug && data.slug !== category.slug) {
            const existing = await this.categoryRepo.findOne({
                where: { slug: data.slug },
            })

            if (existing) {
                throw new Error('Category with this slug already exists')
            }
        }

        Object.assign(category, data)

        return await this.categoryRepo.save(category)
    }

    async delete(id: string) {
        const productRepo = AppDataSource.getRepository('Product')
        const productCount = await productRepo.count({
            where: { categoryId: id },
        })

        if (productCount > 0) {
            throw new Error(
                'Cannot delete category with products. Move or delete products first.',
            )
        }

        await this.categoryRepo.delete(id)
    }
    async reorder(categoryOrders: { id: string; displayOrder: number }[]) {
        for (const { id, displayOrder } of categoryOrders) {
            await this.categoryRepo.update(id, { displayOrder })
        }

        return await this.findAll()
    }
}
