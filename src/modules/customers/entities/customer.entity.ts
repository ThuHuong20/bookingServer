import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fullName: string

    @Column()
    phoneNumber: string

    @Column()
    email: string

    @Column({default: Date.now()})
    createdAt: string

    @Column({default: Date.now()})
    updatedAt: string

    @Column({default: false})
    IsDelete: boolean

    @Column({default: true})
    status: boolean

    @OneToMany(() => Appointment, (appointment) => appointment.customer)
    appointments: Appointment[]
}
