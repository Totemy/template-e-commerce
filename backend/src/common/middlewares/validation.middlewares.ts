import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (let validation of validations) {
            await validation.run(req)
        }

        const errors = validationResult(req)

        if (errors.isEmpty()) {
            return next()
        }

        const extractedErrors = errors.array().map((err) => ({
            field: err.type === 'field' ? err.path : undefined,
            message: err.msg,
        }))

        return res.status(400).json({
            error: 'Validation failed',
            details: extractedErrors,
        })
    }
}

import { body, param, query } from 'express-validator'

export const productValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 3, max: 200 })
            .withMessage('Name must be between 3 and 200 characters'),
        body('slug')
            .notEmpty()
            .withMessage('Slug is required')
            .matches(/^[a-z0-9-]+$/)
            .withMessage(
                'Slug must contain only lowercase letters, numbers, and hyphens',
            ),
        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .isLength({ min: 10 })
            .withMessage('Description must be at least 10 characters'),
        body('price')
            .notEmpty()
            .withMessage('Price is required')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        body('weight')
            .notEmpty()
            .withMessage('Weight is required')
            .isFloat({ min: 0 })
            .withMessage('Weight must be a positive number'),
        body('material')
            .notEmpty()
            .withMessage('Material is required')
            .isIn(['silver_925', 'gold_585', 'gold_750', 'platinum', 'steel'])
            .withMessage('Invalid material'),
        body('categoryIds')
            .isArray({ min: 1 })
            .withMessage('At least one category is required'),
        body('compareAtPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Compare at price must be a positive number'),
        body('images')
            .optional()
            .isArray()
            .withMessage('Images must be an array'),
        body('variants')
            .optional()
            .isArray()
            .withMessage('Variants must be an array'),
    ],
    update: [
        param('id').isUUID().withMessage('Invalid product ID'),
        body('name')
            .optional()
            .isLength({ min: 3, max: 200 })
            .withMessage('Name must be between 3 and 200 characters'),
        body('slug')
            .optional()
            .matches(/^[a-z0-9-]+$/)
            .withMessage(
                'Slug must contain only lowercase letters, numbers, and hyphens',
            ),
        body('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        body('weight')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Weight must be a positive number'),
    ],
    getBySlug: [
        param('slug')
            .notEmpty()
            .withMessage('Slug is required')
            .matches(/^[a-z0-9-]+$/)
            .withMessage('Invalid slug format'),
    ],
}

export const orderValidation = {
    create: [
        body('customerName')
            .notEmpty()
            .withMessage('Customer name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters'),
        body('customerEmail')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format'),
        body('customerPhone')
            .notEmpty()
            .withMessage('Phone is required')
            .matches(/^\+?[0-9]{10,15}$/)
            .withMessage('Invalid phone format'),
        body('paymentMethod')
            .notEmpty()
            .withMessage('Payment method is required')
            .isIn(['card', 'cash_on_delivery'])
            .withMessage('Invalid payment method'),
        body('shippingAddress')
            .notEmpty()
            .withMessage('Shipping address is required'),
        body('shippingAddress.city').notEmpty().withMessage('City is required'),
        body('shippingAddress.address')
            .notEmpty()
            .withMessage('Address is required'),
        body('shippingAddress.postalCode')
            .notEmpty()
            .withMessage('Postal code is required'),
        body('items')
            .isArray({ min: 1 })
            .withMessage('Order must contain at least one item'),
        body('items.*.productId')
            .notEmpty()
            .withMessage('Product ID is required')
            .isUUID()
            .withMessage('Invalid product ID'),
        body('items.*.variantId')
            .optional()
            .isUUID()
            .withMessage('Invalid variant ID'),
        body('items.*.quantity')
            .notEmpty()
            .withMessage('Quantity is required')
            .isInt({ min: 1 })
            .withMessage('Quantity must be at least 1'),
    ],
    updateStatus: [
        param('id').isUUID().withMessage('Invalid order ID'),
        body('status')
            .notEmpty()
            .withMessage('Status is required')
            .isIn([
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
            ])
            .withMessage('Invalid status'),
    ],
}

export const categoryValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters'),
        body('slug')
            .notEmpty()
            .withMessage('Slug is required')
            .matches(/^[a-z0-9-]+$/)
            .withMessage(
                'Slug must contain only lowercase letters, numbers, and hyphens',
            ),
        body('description')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Description must not exceed 500 characters'),
    ],
}

export const authValidation = {
    login: [
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ],
    refresh: [
        body('refreshToken')
            .notEmpty()
            .withMessage('Refresh token is required'),
    ],
}
