import { Router } from 'express'
import { ProductController } from './product.controller'

const router = Router()
const productsController = new ProductController()

/**
 * GET /api/products
 * Query: ?categoryId=uuid&isFeatured=true&search=каблучка
 */
router.get('/', (req, res) => productsController.getAll(req, res))

//GET /api/products/:slug

router.get('/:slug', (req, res) => productsController.getBySlug(req, res))

export default router
