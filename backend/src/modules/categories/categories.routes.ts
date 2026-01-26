import { Router } from 'express'
import { CategoriesController } from './categories.controller'

const router = Router()
const categoriesController = new CategoriesController()

//GET /api/categories

router.get('/', (req, res) => categoriesController.getAll(req, res))

//GET /api/categories/:slug

router.get('/:slug', (req, res) => categoriesController.getBySlug(req, res))

export default router
