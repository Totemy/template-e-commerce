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

    @ManyToOne(() => Order, (order) => order.items, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'order_id' })
    order!: Order

    @ManyToOne(() => Product)
    product!: Product

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
