import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { config } from '../../config/env'

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
})

const storage = multer.memoryStorage()

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Only image files are allowed'))
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})

export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string = 'products',
): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `jewelry-store/${folder}`,
                resource_type: 'image',
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error)
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    })
                } else {
                    reject(new Error('Upload failed'))
                }
            },
        )

        uploadStream.end(fileBuffer)
    })
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error)
        throw error
    }
}

export const uploadSingleImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
            })
        }

        const result = await uploadToCloudinary(req.file.buffer, 'products')

        ;(req as any).uploadedImage = {
            url: result.url,
            publicId: result.publicId,
        }

        next()
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to upload image',
            message: error.message,
        })
    }
}

export const uploadMultipleImages = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({
                error: 'No files uploaded',
            })
        }

        const uploadPromises = req.files.map((file) =>
            uploadToCloudinary(file.buffer, 'products'),
        )

        const results = await Promise.all(uploadPromises)

        ;(req as any).uploadedImages = results.map((result) => ({
            url: result.url,
            publicId: result.publicId,
        }))

        next()
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to upload images',
            message: error.message,
        })
    }
}
