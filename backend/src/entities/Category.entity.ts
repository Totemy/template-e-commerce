import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { Product } from './Product.entity'

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name!: string

    @Column({ unique: true })
    slug!: string

    @Column({ type: 'text', nullable: true })
    description?: string

    @Column({ name: 'image_url', nullable: true })
    imageUrl?: string

    @Column({ name: 'parent_id', nullable: true })
    parentId?: string

    @ManyToOne('Category', 'children', { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent?: any

    @OneToMany('Category', 'parent')
    children!: any[]

    @Column({ name: 'display_order', default: 0 })
    displayOrder!: number

    @Column({ name: 'is_active', default: true })
    isActive!: boolean

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date

    // Relations
    @OneToMany('Product', 'category')
    products!: Product[]
}
