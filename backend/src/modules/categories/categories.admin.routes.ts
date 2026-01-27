import { Router } from 'express'
import { CategoriesController } from './categories.controller'
// import { authenticate } from '../../common/middlewares/auth.middleware'; // Додамо пізніше

const router = Router()
const categoriesController = new CategoriesController()

//POST /api/admin/categories

router.post('/', (req, res) => categoriesController.create(req, res))

// PUT /api/admin/categories/:id

router.put('/:id', (req, res) => categoriesController.update(req, res))

// DELETE /api/admin/categories/:id
router.delete('/:id', (req, res) => categoriesController.delete(req, res))

// POST /api/admin/categories/reorder

router.post('/reorder', (req, res) => categoriesController.reorder(req, res))

export default router
