import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()
const authController = new AuthController()

// Public routes
router.post(
    '/register',
    AuthController.registerValidation,
    authController.register.bind(authController),
)

router.post(
    '/login',
    AuthController.loginValidation,
    authController.login.bind(authController),
)

router.post('/refresh', authController.refresh.bind(authController))

router.post('/logout', authController.logout.bind(authController))

// Protected routes
router.get(
    '/me',
    authenticate,
    authController.getCurrentUser.bind(authController),
)

export default router
