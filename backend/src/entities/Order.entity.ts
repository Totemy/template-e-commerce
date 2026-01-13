import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm'
import { User } from './User.entity'
import { OrderItem } from './OrderItem.entity'

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum PaymentMethod {
    CARD = 'card',
    CASH_ON_DELIVERY = 'cash_on_delivery',
    BANK_TRANSFER = 'bank_transfer',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ name: 'order_number', unique: true })
    orderNumber!: string

    @Column({ name: 'user_id', nullable: true })
    userId?: string

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user!: User

    @Column()
    email!: string

    @Column()
    phone!: string

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status!: OrderStatus

    @Column({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus!: PaymentStatus

    @Column({
        name: 'payment_method',
        type: 'enum',
        enum: PaymentMethod,
    })
    paymentMethod!: PaymentMethod

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number

    @Column({ name: 'shipping_cost', type: 'decimal', precision: 10, scale: 2 })
    shippingCost!: number

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    tax!: number

    @Column({
        name: 'discount_amount',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    })
    discountAmount!: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total!: number

    @Column({ default: 'UAH' })
    currency!: string

    @Column({ name: 'shipping_address', type: 'jsonb' })
    shippingAddress!: {
        recipientName: string
        phone: string
        country: string
        city: string
        postalCode: string
        addressLine1: string
        addressLine2?: string
    }

    @Column({ name: 'billing_address', type: 'jsonb', nullable: true })
    billingAddress?: object

    @Column({ name: 'customer_notes', type: 'text', nullable: true })
    customerNotes?: string

    @Column({ name: 'admin_notes', type: 'text', nullable: true })
    adminNotes?: string

    @Column({ name: 'tracking_number', nullable: true })
    trackingNumber?: string

    @Column({ name: 'shipped_at', nullable: true })
    shippedAt?: Date

    @Column({ name: 'delivered_at', nullable: true })
    deliveredAt?: Date

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date

    // Relations
    @OneToMany('OrderItem', 'order', { cascade: true })
    items!: OrderItem[]
}
