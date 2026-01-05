import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { config } from './config/env'
import { version } from 'os'

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
        })
    })

    app.use((req: Request, res: Response) => {
        res.status(404).json({
            error: 'Not Found',
            path: req.path,
        })
    })

    return app
}
