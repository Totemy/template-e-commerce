import {
    generateAccessToken,
    generateRefreshToken,
} from '../../common/utils/jwt'
import { comparePasswords, hashPassword } from '../../common/utils/password'
import { AppDataSource } from '../../database/data-source'
import { Admin } from '../../database/entities/Admin.entity'
import { RefreshToken } from '../../database/entities/RefreshToken.entity'

export class AdminService {
    private adminRepo = AppDataSource.getRepository(Admin)
    private tokenRepo = AppDataSource.getRepository(RefreshToken)

    async login(email: string, password: string) {
        const admin = await this.adminRepo.findOne({
            where: { email },
        })

        if (!admin) {
            throw new Error('Invalid credentials')
        }

        const isValid = await comparePasswords(password, admin.passwordHash)

        if (!isValid) {
            throw new Error('Invalid credentials')
        }

        const accessToken = generateAccessToken({
            userId: admin.id,
            email: admin.email,
            role: 'admin',
        })

        const refreshToken = generateRefreshToken({
            userId: admin.id,
            email: admin.email,
            role: 'admin',
        })

        await this.saveRefreshToken(admin.id, refreshToken)

        return {
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
            },
            accessToken,
            refreshToken,
        }
    }
    async createFirstAdmin(data: {
        email: string
        password: string
        name: string
    }) {
        const count = await this.adminRepo.count()

        if (count > 0) {
            throw new Error('Admin already exists')
        }

        const passwordHash = await hashPassword(data.password)

        const admin = this.adminRepo.create({
            email: data.email,
            passwordHash,
            name: data.name,
        })

        return await this.adminRepo.save(admin)
    }
    async refreshAccessToken(refreshToken: string) {
        const storedToken = await this.tokenRepo.findOne({
            where: { token: refreshToken },
        })

        if (!storedToken) {
            throw new Error('Invalid refresh token')
        }

        if (new Date() > storedToken.expiresAt) {
            await this.tokenRepo.remove(storedToken)
            throw new Error('Refresh token expired')
        }

        const admin = await this.adminRepo.findOne({
            where: { id: storedToken.adminId },
        })

        if (!admin) {
            throw new Error('Admin not found')
        }

        const accessToken = generateAccessToken({
            userId: admin.id,
            email: admin.email,
            role: 'admin',
        })

        return { accessToken }
    }
    async logout(refreshToken: string) {
        await this.tokenRepo.delete({ token: refreshToken })
    }

    private async saveRefreshToken(adminId: string, token: string) {
        const expiresAt = new Date()

        expiresAt.setDate(expiresAt.getDate() + 7)

        const refreshToken = this.tokenRepo.create({
            adminId,
            token,
            expiresAt,
        })

        await this.tokenRepo.save(refreshToken)
    }
}
