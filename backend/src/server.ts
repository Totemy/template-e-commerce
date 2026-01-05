import 'reflect-metadata'
import { createApp } from './app'
import { initializeDatabase } from './config/database'
import { config } from './config/env'

const startServer = async () => {
    try {
        await initializeDatabase()

        const app = createApp()

        app.listen(config.port, () => {
            console.log('Server started successfully!')
            console.log(`Environment: ${config.nodeEnv}`)
            console.log(`Server http://localhost:${config.port}`)
            console.log(`Health: http://localhost:${config.port}/health`)
            console.log(`Frontend: ${config.frontendUrl}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
