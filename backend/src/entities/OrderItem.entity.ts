import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { Order } from './Order.entity'
import { Product } from './Product.entity'

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ name: 'order_id' })
    orderId!: string

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order!: Order

    @Column({ name: 'product_id' })
    productId!: string

    @ManyToOne(() => Product, (product) => product.orderItems)
    @JoinColumn({ name: 'product_id' })
    product!: Product

    @Column({ name: 'variant_id', nullable: true })
    variantId?: string

    @ManyToOne('ProductVariant', { nullable: true })
    @JoinColumn({ name: 'variant_id' })
    variant?: any

    @Column({ name: 'product_snapshot', type: 'jsonb' })
    productSnapshot!: {
        name: string
        sku: string
        image: string
        attributes?: object
    }

    @Column()
    quantity!: number

    @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
    unitPrice!: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date
}
