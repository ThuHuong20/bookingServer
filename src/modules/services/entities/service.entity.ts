import { AppointmentDetail } from 'src/modules/appointment-details/entities/appointment-detail.entity';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { StaffService } from 'src/modules/staff-services/entities/staff-service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGYVzWTuDXyCf02RIHia-_X-mnkW_476LQjyc9tZfpOg&s',
  })
  avatar: string;

  @Column({ unique: true })
  name: string;

  @Column('varchar', {
    length: 250,
  })
  desc: string;

  @Column()
  price: number;

  @Column({ default: true })
  status: boolean;

  @Column({ default: false })
  isDelete: boolean;

  @Column({
    default: Date.now(),
  })
  createAt: string;

  @Column({
    default: Date.now(),
  })
  updateAt: string;

  // @Column()
  // duration: number

  @OneToMany(
    () => AppointmentDetail,
    (appointmentDetail) => appointmentDetail.service,
  )
  appointmentDetails: AppointmentDetail[];

  @OneToMany(() => StaffService, (staffService) => staffService.service)
  staffServices: StaffService[];
}
