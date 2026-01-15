import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm'

@Entity('product_images')
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    productId!: string

    @Column()
    url!: string

    @Column({ nullable: true })
    altText?: string

    @Column({ default: 0 })
    displayOrder!: number

    @Column({ default: false })
    isPrimary!: boolean

    @CreateDateColumn()
    createdAt!: Date
}
