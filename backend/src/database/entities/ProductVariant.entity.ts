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

@Entity('product_variants')
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @ManyToOne(() => Product, (product) => product.variants, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product!: Product

    @Column()
    productId!: string

    @Column()
    name!: string

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    priceAdjustment!: number

    @Column({ default: 0 })
    stockQuantity!: number

    @Column({ default: true })
    isAvailable!: boolean

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
