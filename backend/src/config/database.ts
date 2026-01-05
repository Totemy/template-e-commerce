import { DataSource } from 'typeorm'
import { config } from './env'
import { User } from '../entities/User.entity'
import { Product } from '../entities/Product.entity'
import { Category } from '../entities/Category.entity'
import { Order } from '../entities/Order.entity'
import { OrderItem } from '../entities/OrderItem.entity'
import { Cart } from '../entities/Cart.entity'
import { CartItem } from '../entities/CartItem.entity'
import { Review } from '../entities/Review.entity'
import { Address } from '../entities/Address.entity'
import { ProductImage } from '../entities/ProductImage.entity'
import { ProductVariant } from '../entities/ProductVariant.entity'
import { RefreshToken } from '../entities/RefreshToken.entity'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.name,
    synchronize: config.isProduction ? false : true,
    logging: !config.isProduction,
    entities: [
        User,
        Product,
        Category,
        Order,
        OrderItem,
        Cart,
        CartItem,
        Review,
        Address,
        ProductImage,
        ProductVariant,
        RefreshToken,
    ],
    migrations: ['src/database/migration/**/*.ts'],
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
