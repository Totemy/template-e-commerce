import dotenv from 'dotenv'

dotenv.config()

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',

    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'silver_jewelry_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'change-this-secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-secret',
        accessExpire: process.env.JWT_ACCESS_EXPIRE || '15m',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    },
}
