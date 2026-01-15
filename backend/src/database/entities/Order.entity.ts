import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum PaymentMethod {
    CARD = 'card',
    CASH_ON_DELIVERY = 'cash_on_delivery',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ unique: true })
    orderNumber!: string

    @Column()
    customerName!: string

    @Column()
    customerEmail!: string

    @Column()
    customerPhone!: string

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status!: OrderStatus

    @Column({
        type: 'enum',
        enum: PaymentMethod,
    })
    paymentMethod!: PaymentMethod

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    shippingCost!: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total!: number

    @Column({ type: 'jsonb' })
    shippingAddress!: {
        city: string
        address: string
        postalCode: string
    }

    @Column({ type: 'text', nullable: true })
    customerNotes?: string

    @Column({ type: 'text', nullable: true })
    adminNotes?: string

    @Column({ nullable: true })
    trackingNumber?: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
