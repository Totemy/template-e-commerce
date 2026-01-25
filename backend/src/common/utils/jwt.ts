import jwt from 'jsonwebtoken'
import { config } from '../../config/env'

export interface JwtPayload {
    userId: string
    email: string
}
/**
 * generate Access Token (15 min)
 */

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpire,
    })
}

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpire,
    })
}

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, config.jwt.accessSecret) as JwtPayload
    } catch (error) {
        throw new Error('Invalid or expired access token')
    }
}

export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload
    } catch (error) {
        throw new Error('Invalid or expired refresh token')
    }
}
