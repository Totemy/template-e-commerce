import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { User } from './User.entity'

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ name: 'user_id' })
    userId!: string

    @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User

    @Column({ name: 'is_default', default: false })
    isDefault!: boolean

    @Column({ name: 'recipient_name' })
    recipientName!: string

    @Column()
    phone!: string

    @Column()
    country!: string

    @Column()
    city!: string

    @Column({ name: 'postal_code' })
    postalCode!: string

    @Column({ name: 'address_line1' })
    addressLine1!: string

    @Column({ name: 'address_line2', nullable: true })
    addressLine2?: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date
}
