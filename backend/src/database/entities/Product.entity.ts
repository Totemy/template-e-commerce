import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm'
import { ProductVariant } from './ProductVariant.entity'
import { Category } from './Category.entity'
import { decimalTransformer } from '../../common/types/helpers'

export enum Material {
    SILVER_925 = 'silver_925',
    GOLD_585 = 'gold_585',
    GOLD_750 = 'gold_750',
    PLATINUM = 'platinum',
    STEEL = 'steel',
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @ManyToMany(() => Category, (category) => category.products)
    @JoinTable({
        name: 'product_categories',
        joinColumn: { name: 'product_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories!: Category[]

    @OneToMany(() => ProductVariant, (variant) => variant.product, {
        cascade: true,
    })
    variants!: ProductVariant[]

    @Column()
    name!: string

    @Column({ unique: true })
    slug!: string

    @Column({ type: 'text' })
    description!: string

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: decimalTransformer,
    })
    price!: number

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        transformer: decimalTransformer,
    })
    compareAtPrice?: number

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
        transformer: decimalTransformer,
    })
    weight!: number

    @Column({
        type: 'enum',
        enum: Material,
        default: Material.STEEL,
    })
    material!: Material

    @Column('jsonb', { default: [] })
    images!: Array<{
        url: string
        altText?: string
    }>

    @Column({ default: true })
    isAvailable!: boolean

    @Column({ default: false })
    isFeatured!: boolean

    @Column({ default: false })
    isNewArrival!: boolean

    @CreateDateColumn()
    createdAt!: Date | null

    @UpdateDateColumn()
    updatedAt!: Date | null
}
