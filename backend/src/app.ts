import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { config } from './config/env'
import { version } from 'os'
import categoriesRoutes from './modules/categories/categories.routes'
import ordersRoutes from './modules/orders/orders.routes'
import productsRoutes from './modules/product/products.routes'
import adminRoutes from './modules/admin/admin.routes'
import categoriesAdminRoutes from './modules/categories/categories.admin.routes'
import productsAdminRoutes from './modules/product/products.admin.routes'
import ordersAdminRoutes from './modules/orders/orders.admin.routes'

export const createApp = (): Express => {
    const app = express()

    app.use(
        cors({
            origin: config.frontendUrl,
            credentials: true,
        }),
    )

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.get('/health', (req: Request, res: Response) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() })
    })

    app.get('/api', (req: Request, res: Response) => {
        res.json({
            message: 'Silver Jewelry API',
            version: '1.0.0',
            endpoints: {
                public: [
                    'GET  /api/categories',
                    'GET  /api/categories/:slug',
                    'GET  /api/products',
                    'GET  /api/products/:slug',
                    'POST /api/orders',
                ],
                admin: [
                    'POST /api/admin/setup',
                    'POST /api/admin/login',
                    'POST /api/admin/refresh',
                    'POST /api/admin/logout',
                    'GET  /api/admin/orders',
                    'POST /api/admin/categories',
                    'POST /api/admin/products',
                ],
            },
        })
    })

    // public routes
    app.use('/api/categories', categoriesRoutes)
    app.use('/api/products', productsRoutes)
    app.use('/api/orders', ordersRoutes)

    //admin routes
    app.use('/api/admin', adminRoutes)
    app.use('/api/admin/categories', categoriesAdminRoutes)
    app.use('/api/admin/products', productsAdminRoutes)
    app.use('/api/admin/orders', ordersAdminRoutes)

    app.use((req: Request, res: Response) => {
        res.status(404).json({
            error: 'Not Found',
            path: req.path,
        })
    })

    return app
}
