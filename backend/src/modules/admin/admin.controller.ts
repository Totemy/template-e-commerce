import { Request, Response } from 'express'
import { AdminService } from './admin.service'
import { error } from 'console'

const adminService = new AdminService()

export class AdminController {
    /**
     * POST /api/admin/login
     * Логін адміна
     */

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are requiered',
                })
            }
            const result = await adminService.login(email, password)

            res.status(200).json({
                message: 'Login successful',
                data: result,
            })
        } catch (error: any) {
            res.status(401).json({
                error: error.message || 'Login failed',
            })
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body

            if (!refreshToken) {
                return res.status(400).json({
                    error: 'Refresh token is required',
                })
            }

            const result = await adminService.refreshAccessToken(refreshToken)

            res.status(200).json({
                message: 'Token refreshed',
                data: result,
            })
        } catch (error: any) {
            res.status(401).json({
                error: error.message || 'Token refresh failed',
            })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body

            if (!refreshToken) {
                return res.status(400).json({
                    error: 'Refresh token is required',
                })
            }

            await adminService.logout(refreshToken)

            res.status(200).json({
                message: 'Logout successful',
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Logout failed',
            })
        }
    }

    async setup(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body

            if (!email || !password || !name) {
                return res.status(400).json({
                    error: 'Email, password and name are required',
                })
            }

            const admin = await adminService.createFirstAdmin({
                email,
                password,
                name,
            })

            res.status(201).json({
                message: 'Admin created successfully',
                data: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                },
            })
        } catch (error: any) {
            res.status(401).json({
                error: error.message || 'Admin creation failed',
            })
        }
    }
}
