import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { Cart } from './Cart.entity'
import { Product } from './Product.entity'

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ name: 'cart_id' })
    cartId!: string

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    cart!: Cart

    @Column({ name: 'product_id' })
    productId!: string

    @ManyToOne(() => Product, (product) => product.cartItems)
    @JoinColumn({ name: 'product_id' })
    product!: Product

    @Column({ name: 'variant_id', nullable: true })
    variantId?: string

    @ManyToOne('ProductVariant', { nullable: true })
    @JoinColumn({ name: 'variant_id' })
    variant?: any

    @Column()
    quantity!: number

    @Column({
        name: 'price_snapshot',
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    priceSnapshot!: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date
}
