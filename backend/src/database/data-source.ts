import { DataSource } from 'typeorm'
import { config } from '../config/env'
import { Admin } from './entities/Admin.entity'
import { Product } from './entities/Product.entity'
import { Category } from './entities/Category.entity'
import { ProductVariant } from './entities/ProductVariant.entity'
import { Order } from './entities/Order.entity'
import { OrderItem } from './entities/OrderItem.entity'
import { RefreshToken } from './entities/RefreshToken.entity'
import 'dotenv/config'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    synchronize: true,
    logging: true,
    entities: [
        Admin,
        Category,
        Product,
        ProductVariant,
        Order,
        OrderItem,
        RefreshToken,
    ],

    migrations: ['src/database/migration/*.ts'],
    migrationsTableName: 'migrations',
})

export const initializeDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.initialize()
        console.log('Database connect')
    } catch (error) {
        console.error('Database connection failed', error)
        process.exit(1)
    }
}
