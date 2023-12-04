import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Voucher } from "src/modules/vouchers/entities/voucher.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VoucherHistory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    appointmentId: number
    @OneToOne(() => Appointment)
    @JoinColumn({ name: "appointmentId" })
    appointment: Appointment

    @Column()
    voucherId: number
    @OneToOne(() => Voucher)
    @JoinColumn({ name: 'voucherId' })
    voucher: Voucher

    @Column({ unique: false })
    customerId: number
    // @OneToOne(() => Customer)
    // @JoinColumn({ name: 'customerId' })
    // customer: Customer

    @Column({ default: Date.now() })
    createAt: string
}
