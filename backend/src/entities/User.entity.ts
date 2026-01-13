import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm'
import { Order } from './Order.entity'
import { Review } from './Review.entity'
import { Address } from './Address.entity'
import { Cart } from './Cart.entity'
import { RefreshToken } from './RefreshToken.entity'

export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ unique: true })
    email!: string

    @Column({ name: 'password_hash' })
    passwordHash!: string

    @Column({ name: 'first_name' })
    firstName!: string

    @Column({ name: 'last_name' })
    lastName!: string

    @Column({ nullable: true })
    phone?: string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role!: UserRole

    @Column({ name: 'is_email_verified', default: false })
    isEmailVerified!: boolean

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date

    @OneToMany('Order', 'user')
    orders!: Order[]

    @OneToMany('Review', 'user')
    reviews!: Review[]

    @OneToMany('Address', 'user')
    addresses!: Address[]

    @OneToMany('Cart', 'user')
    carts!: Cart[]

    @OneToMany('RefreshToken', 'user')
    refreshTokens!: RefreshToken[]
}
