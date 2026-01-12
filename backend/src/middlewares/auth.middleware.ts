import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User.entity'

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                email: string
                role: string
            }
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access token is required' })
        }

        const token = authHeader.substring(7)

        const payload = verifyAccessToken(token)

        const userRepository = AppDataSource.getRepository(User)
        const user = await userRepository.findOne({
            where: { id: payload.userId },
        })

        if (!user) {
            return res.status(401).json({ error: 'User not found' })
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        }

        next()
    } catch (error: any) {
        res.status(401).json({ error: error.message || 'Invalid token' })
    }
}

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        if (!roles.includes(req.user.role as UserRole)) {
            return res.status(403).json({ error: 'Access denied' })
        }

        next()
    }
}
