import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    categoryId!: string

    @Column({ unique: true })
    sku!: string

    @Column()
    name!: string

    @Column({ unique: true })
    slug!: string

    @Column({ type: 'text' })
    description!: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    compareAtPrice?: number

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    weight!: number

    @Column()
    metal!: string // "925 проба"

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
