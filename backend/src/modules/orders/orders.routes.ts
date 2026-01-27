import { Router } from 'express'
import { OrdersController } from './orders.controller'

const router = Router()
const ordersController = new OrdersController()

//POST /api/orders

router.post('/', (req, res) => ordersController.create(req, res))

export default router
