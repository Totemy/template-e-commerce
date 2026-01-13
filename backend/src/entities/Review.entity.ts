import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { Product } from './Product.entity'
import { User } from './User.entity'
import { Order } from './Order.entity'

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ name: 'product_id' })
    productId!: string

    @ManyToOne(() => Product, (product) => product.reviews)
    @JoinColumn({ name: 'product_id' })
    product!: Product

    @Column({ name: 'user_id' })
    userId!: string

    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({ name: 'user_id' })
    user!: User

    @Column({ name: 'order_id', nullable: true })
    orderId?: string

    @ManyToOne(() => Order, { nullable: true })
    @JoinColumn({ name: 'order_id' })
    order?: Order

    @Column({ type: 'int' })
    rating!: number

    @Column({ nullable: true })
    title?: string

    @Column({ type: 'text' })
    comment!: string

    @Column({ name: 'is_verified_purchase', default: false })
    isVerifiedPurchase!: boolean

    @Column({ name: 'is_approved', default: false })
    isApproved!: boolean

    @Column({ name: 'admin_reply', type: 'text', nullable: true })
    adminReply?: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date
}
