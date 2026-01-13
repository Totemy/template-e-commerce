import { DataSource } from 'typeorm'
import { config } from './env'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    synchronize: config.isProduction ? false : true,
    logging: !config.isProduction,
    entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    subscribers: [],
})

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize()
        console.log('Database connected successfully')
    } catch (error) {
        console.log('Database connection failed: ', error)
        process.exit(1)
    }
}
