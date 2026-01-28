import { Router } from 'express'
import { AdminController } from './admin.controller'

const router = Router()
const adminController = new AdminController()

// POST /api/admin/setup

router.post('/setup', adminController.setup.bind(adminController))

//POST /api/admin/login

router.post('/login', adminController.login.bind(adminController))

//POST /api/admin/refresh

router.post('/refresh', adminController.refresh.bind(adminController))

//POST /api/admin/logout

router.post('/logout', adminController.logout.bind(adminController))

export default router
