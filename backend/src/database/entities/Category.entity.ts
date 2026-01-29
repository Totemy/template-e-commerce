import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ unique: true })
    name!: string

    @Column({ unique: true })
    slug!: string

    @Column({ type: 'text', nullable: true })
    description?: string

    @Column({ nullable: true })
    imageUrl?: string

    @Column({ default: 0 })
    displayOrder!: number

    @Column({ default: true })
    isActive!: boolean

    @CreateDateColumn()
    createdAt?: Date | null

    @UpdateDateColumn()
    updatedAt?: Date | null
}
