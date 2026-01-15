import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('product_variants')
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    productId!: string

    @Column()
    name!: string

    @Column({ unique: true })
    sku!: string

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
