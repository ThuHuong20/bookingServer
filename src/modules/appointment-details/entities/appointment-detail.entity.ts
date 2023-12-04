import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Service } from "src/modules/services/entities/service.entity";
import { Staff } from "src/modules/staffs/entities/staff.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AppointmentDetail {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    price: number

    @Column({default: 1})
    slot: number

    @Column({default: Date.now()})
    createdAt: string

    @Column({default: Date.now()})
    updatedAt: string

    @Column({default: false})
    IsDelete: boolean


    @Column()
    appointmentId: number
    @ManyToOne(() => Appointment, (appointment) => appointment.appointmentDetails)
    @JoinColumn({ name: "appointmentId" })
    appointment: Appointment


    
    @Column()
    serviceId: number
    @ManyToOne(() => Service, (service) => service.appointmentDetails)
    @JoinColumn({ name: "serviceId" })
    service: Service

    @Column()
    staffId: number
    @ManyToOne(() => Staff, (staff) => staff.appointmentDetails)
    @JoinColumn({ name: "staffId" })
    staff: Staff
}
