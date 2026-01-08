import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User.entity'
import { RefreshToken } from '../entities/RefreshToken.entity'
import { hashPassword, comparePasswords } from '../utils/password'
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    JwtPayload,
} from '../utils/jwt'

export class AuthService {
    private userRepository = AppDataSource.getRepository(User)
    private refreshTokenRepository = AppDataSource.getRepository(RefreshToken)

    async register(data: {
        email: string
        password: string
        firstName: string
        lastName: string
        phone?: string
    }) {
        const existingUser = await this.userRepository.findOne({
            where: { email: data.email },
        })
        if (existingUser) {
            throw new Error('User with this email already exists')
        }
        const passwordHash = await hashPassword(data.password)

        const user = this.userRepository.create({
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: UserRole.CUSTOMER,
        })
        await this.userRepository.save(user)

        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        }
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        await this.saveRefreshToken(user.id, refreshToken)

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            accessToken,
            refreshToken,
        }
    }
    async logic(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { email },
        })
        if (!user) {
            throw new Error('Invalid email or password')
        }
        const isPasswordValid = await comparePasswords(
            password,
            user.passwordHash,
        )

        if (!isPasswordValid) {
            throw new Error('Invalid email or password')
        }

        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        }

        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        await this.saveRefreshToken(user.id, refreshToken)

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            accessToken,
            refreshToken,
        }
    }
    async refreshAccesToken(refreshToken: string) {
        const payload = verifyRefreshToken(refreshToken)

        const storedToken = await this.refreshTokenRepository.findOne({
            where: { token: refreshToken, userId: payload.userId },
        })

        if (!storedToken) {
            throw new Error('Invalid refresh token')
        }

        // Перевірка чи не expired
        if (new Date() > storedToken.expiresAt) {
            await this.refreshTokenRepository.remove(storedToken)
            throw new Error('Refresh token expired')
        }

        // Генерація нового access token
        const newAccessToken = generateAccessToken({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        })

        return {
            accessToken: newAccessToken,
        }
    }

    async logout(refreshToken: string) {
        await this.refreshTokenRepository.delete({ token: refreshToken })
    }

    private async saveRefreshToken(userId: string, token: string) {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // 7 днів

        const refreshToken = this.refreshTokenRepository.create({
            userId,
            token,
            expiresAt,
        })

        await this.refreshTokenRepository.save(refreshToken)
    }
}
