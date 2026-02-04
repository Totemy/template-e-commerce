import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
    statusCode: number
    isOperational: boolean

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

export const errorMiddleware = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            status: 'error',
        })
    }

    if (err.name === 'QueryFailedError') {
        return res.status(400).json({
            error: 'Database query failed',
            message:
                process.env.NODE_ENV === 'development'
                    ? err.message
                    : undefined,
        })
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            message: err.message,
        })
    }

    console.error('Error:', err)

    return res.status(500).json({
        error: 'Internal server error',
        message:
            process.env.NODE_ENV === 'development'
                ? err.message
                : 'Something went wrong',
    })
}

export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}
