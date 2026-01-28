import { Router } from 'express'
import { ProductController } from './product.controller'

const router = Router()
const productsController = new ProductController()

/**
 * POST /api/admin/products
 * Створити товар
 */
router.post('/', (req, res) => productsController.create(req, res))

/**
 * PUT /api/admin/products/:id
 * Оновити товар
 */
router.put('/:id', (req, res) => productsController.update(req, res))

/**
 * DELETE /api/admin/products/:id
 * Видалити товар
 */
router.delete('/:id', (req, res) => productsController.delete(req, res))

/**
 * POST /api/admin/products/:id/images
 * Додати фото до товару
 */
router.post('/:id/images', (req, res) => productsController.addImage(req, res))

/**
 * DELETE /api/admin/products/images/:imageId
 * Видалити фото
 */
router.delete('/images/:imageId', (req, res) =>
    productsController.deleteImage(req, res),
)

/**
 * POST /api/admin/products/:id/variants
 * Додати варіанти (розміри)
 */
router.post('/:id/variants', (req, res) =>
    productsController.addVariants(req, res),
)

/**
 * PUT /api/admin/products/variants/:variantId
 * Оновити варіант
 */
router.put('/variants/:variantId', (req, res) =>
    productsController.updateVariant(req, res),
)

/**
 * DELETE /api/admin/products/variants/:variantId
 * Видалити варіант
 */
router.delete('/variants/:variantId', (req, res) =>
    productsController.deleteVariant(req, res),
)

export default router
