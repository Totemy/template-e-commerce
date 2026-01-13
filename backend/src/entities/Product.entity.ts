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
import { Category } from './Category.entity'

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ name: 'category_id' })
    categoryId!: string

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category!: Category

    @Column({ unique: true })
    sku!: string

    @Column()
    name!: string

    @Column({ unique: true })
    slug!: string

    @Column({ type: 'text' })
    description!: string

    @Column({ name: 'short_description', nullable: true })
    shortDescription?: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number

    @Column({
        name: 'compare_at_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    compareAtPrice?: number

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cost?: number

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    weight!: number

    @Column({ name: 'metal_purity' })
    metalPurity!: string

    @Column({ name: 'is_available', default: true })
    isAvailable!: boolean

    @Column({ name: 'is_featured', default: false })
    isFeatured!: boolean

    @Column({ name: 'is_new_arrival', default: false })
    isNewArrival!: boolean

    @Column({ name: 'view_count', default: 0 })
    viewCount!: number

    @Column({ name: 'meta_title', nullable: true })
    metaTitle?: string

    @Column({ name: 'meta_description', nullable: true })
    metaDescription?: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date

    // Relations - string references
    @OneToMany('ProductImage', 'product', { cascade: true })
    images!: any[]

    @OneToMany('ProductVariant', 'product', { cascade: true })
    variants!: any[]

    @OneToMany('Review', 'product')
    reviews!: any[]

    @OneToMany('OrderItem', 'product')
    orderItems!: any[]

    @OneToMany('CartItem', 'product')
    cartItems!: any[]
}
