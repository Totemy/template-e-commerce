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
import { User } from './User.entity'

@Entity('carts')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ name: 'user_id', nullable: true })
    userId?: string

    @ManyToOne(() => User, (user) => user.carts, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user?: User

    @Column({ name: 'session_id', nullable: true })
    sessionId?: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date

    @OneToMany('CartItem', 'cart', { cascade: true })
    items!: any[]
}
