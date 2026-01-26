import { Router } from 'express'
import { AdminController } from './admin.controller'

const router = Router()
const adminController = new AdminController()

// POST /api/admin/setup

router.post('/setup', (req, res) => adminController.setup(req, res))

//POST /api/admin/login

router.post('/login', (res, req) => adminController.login(req, res))

//POST /api/admin/refresh

router.post('/refresh', (req, res) => adminController.refresh(res, req))

//POST /api/admin/logout

router.post('/logout', (res, req) => adminController.logout(res, req))

export default router
