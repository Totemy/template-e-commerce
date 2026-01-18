import { AppDataSource } from '../../database/data-source'
import { Order, OrderStatus } from '../../database/entities/Order.entity'
import { OrderItem } from '../../database/entities/OrderItem.entity'
import { Product } from '../../database/entities/Product.entity'
import { ProductVariant } from '../../database/entities/ProductVariant.entity'

export class OrderService {
    private orderRepo = AppDataSource.getRepository(Order)
    private itemRepo = AppDataSource.getRepository(OrderItem)
    private productRepo = AppDataSource.getRepository(Product)
    private variantRepo = AppDataSource.getRepository(ProductVariant)

    async create(data: {
        customerName: string
        customerEmail: string
        customerPhone: string
        paymentMethod: 'card' | 'cash_on_delivery'
        shippingAddress: {
            city: string
            address: string
            postalCode: string
        }
        customerNotes?: string
        item: {
            productId: string
            variantId?: string
            quantity: number
        }[]
    }) {
        const orderItem = await this.validateAndPrepareItems(data.items)

        const subtotal = orderItem.reduce((sum, item) => sum + item.subtotal, 0)
        const shippingCost = this.calculateShipping(subtotal)
        const total = subtotal + shippingCost

        const orderNumber = await this.generateOrderNumber()

        const order = this.orderRepo.create({
            orderNumber,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            paymentMethod: data.paymentMethod,
            shippingCost: data.shippingAddress,
            customerNotes: data.customerNotes,
            subtotal,
            shippingCost,
            total,
            status: OrderStatus.PENDING,
        })

        const savedOrder = await this.orderRepo.save(order)

        const items = orderItem.map((item) =>
            this.itemRepo.create({
                ...item,
                orderId: savedOrder.id,
            }),
        )

        await this.itemRepo.save(item)

        return {
            ...savedOrder,
            items,
        }
    }

    async findAll(filters?: { status?: OrderStatus }) {
        const query = this.orderRepo.createQueryBuilder('order')

        if (filters?.status) {
            query.where('order.status = :status', { status: filters.status })
        }

        query.orderBy('order.createdAt', 'DESC')

        return await query.getMany()
    }

    async updateStatus(id: string, status: OrderStatus) {
        const order = await this.orderRepo.findOne({ where: { id } })

        if (!order) {
            throw new Error('Order not found')
        }

        order.status = status

        return await this.orderRepo.save(order)
    }

    async addTracking(id: string, trackingNumber: string) {
        const order = await this.orderRepo.findOne({ where: { id } })

        if (!order) {
            throw new Error('Order not found')
        }

        order.trackingNumber = trackingNumber
        order.status = OrderStatus.SHIPPED

        return await this.orderRepo.save(order)
    }

    private async validateAndPrepareItems(
        items: { productId: string; variantId?: string; quantity: number }[],
    ) {
        const orderItems = []

        for (const item of items) {
            const product = await this.productRepo.findOne({
                where: { id: item.productId },
            })

            if (!product || !product.isAvailable) {
                throw new Error(`Prodcut ${item.productId} not available`)
            }

            let variant = null
            if (item.variantId) {
                variant = await this.variantRepo.findOne({
                    where: { id: item.variantId },
                })
                if (!variant || !variant.isAvailable) {
                    throw new Error(`Variant ${item.variantId} not available`)
                }

                if (variant.stockQuantity < item.quantity) {
                    throw new Error(
                        `Not enough stock for ${product.name} (${variant.name})`,
                    )
                }
            }

            const price = variant
                ? Number(product.price) + Number(variant.priceAdjustment)
                : Number(product.price)
            const subtotal = price * item.quantity

            orderItems.push({
                productId: product.id,
                variantId: variant?.id,
                productSnapshot: {
                    name: product.name,
                    sku: variant ? variant.sku : product.sku,
                    price,
                    image: '', // without logic
                },
                quantity: item.quantity,
                price,
                subtotal,
            })
        }

        return orderItems
    }

    // count of price delivery

    private calculateShipping(subtotal: number): number {
        // free delivership
        if (subtotal >= 2000) {
            return 0
        }
        //or 80
        return 80
    }

    private async generateOrderNumber(): Promise<string> {
        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        const startOfDay = new Date(date.setHours(0, 0, 0, 0))
        const endOfDay = new Date(date.setHours(23, 59, 59, 999))

        const count = await this.orderRepo
            .createQueryBuilder('order')
            .where('order.createAt >= :start', { start: startOfDay })
            .andWhere('order.createAt <= :end', { end: endOfDay })
            .getCount()
        const sequence = String(count + 1).padStart(4, '0')

        return `SJ-${year}-${month}-${day}-${sequence}`
    }
}
