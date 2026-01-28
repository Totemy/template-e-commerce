import jwt, { Secret } from 'jsonwebtoken'
import { config } from '../../config/env'

export interface JwtPayload {
    userId: string
    email: string
    role: 'admin' | 'user'
}

const accessSecret = config.jwt.accessSecret as Secret
const refreshSecret = config.jwt.refreshSecret as Secret

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, accessSecret, {
        expiresIn: config.jwt.accessExpire as any,
    })
}

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, refreshSecret, {
        expiresIn: config.jwt.refreshExpire as any,
    })
}

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, accessSecret) as JwtPayload
}

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, refreshSecret) as JwtPayload
}
