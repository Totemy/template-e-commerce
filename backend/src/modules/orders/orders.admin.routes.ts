import { Router } from 'express'
import { OrdersController } from './orders.controller'

const router = Router()
const ordersController = new OrdersController()

/**
 * GET /api/admin/orders
 * Отримати всі замовлення
 * Query: ?status=pending
 */
router.get('/', (req, res) => ordersController.getAll(req, res))

/**
 * GET /api/admin/orders/:id
 * Отримати замовлення по ID
 */
router.get('/:id', (req, res) => ordersController.getById(req, res))

/**
 * PATCH /api/admin/orders/:id/status
 * Оновити статус замовлення
 */
router.patch('/:id/status', (req, res) =>
    ordersController.updateStatus(req, res),
)

/**
 * PATCH /api/admin/orders/:id/tracking
 * Додати трекінг номер
 */
router.patch('/:id/tracking', (req, res) =>
    ordersController.addTracking(req, res),
)

export default router
