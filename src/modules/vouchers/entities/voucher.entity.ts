import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Voucher {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    code: string

    @Column()
    value: number

    @Column()
    discountType: string

    @Column({default: Date.now()})
    createdAt: string

    @Column({default: Date.now()})
    startAt?: string

    @Column({default: Date.now()})
    endAt?: string

    @Column({default: false})
    status: boolean

    @Column({default: false})
    IsDelete: boolean
}
