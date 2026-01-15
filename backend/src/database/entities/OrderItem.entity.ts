import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm'

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    orderId!: string

    @Column()
    productId!: string

    @Column({ nullable: true })
    variantId?: string

    @Column({ type: 'jsonb' })
    productSnapshot!: {
        name: string
        sku: string
        price: number
        image: string
    }

    @Column()
    quantity!: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number

    @CreateDateColumn()
    createdAt!: Date
}
