import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../../config/env'
import { error } from 'console'

export interface AuthRequest extends Request {
    adminId?: string
    admin?: {
        id: string
        email: string
    }
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'No token provided',
            })
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                error: 'Invalid token format',
            })
        }

        try {
            const decoder = jwt.verify(token, config.jwt.accessSecret) as {
                adminId: string
                email: string
            }

            req.adminId = decoder.adminId
            req.admin = {
                id: decoder.adminId,
                email: decoder.email,
            }

            next()
        } catch (jwtError: any) {
            if (jwtError.error === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'Token expired',
                    code: 'TOKEN_EXPIRED',
                })
            }
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    error: 'Invalid token',
                })
            }

            throw jwtError
        }
    } catch (error: any) {
        return res.status(500).json({
            error: 'Authentication failed',
            message: error.message,
        })
    }
}
