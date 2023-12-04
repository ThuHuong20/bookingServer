import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "../customers/entities/customer.entity";
import { Appointment } from "../appointments/entities/appointment.entity";
import { AppointmentSocketGateWay } from "./appointments/appointment.socket";
import { AppointmentDetail } from "../appointment-details/entities/appointment-detail.entity";
import { AppointmentService } from "./appointments/appointment.service";
import { Voucher } from "../vouchers/entities/voucher.entity";
import { VoucherHistory } from "../voucher-history/entities/voucher-history.entity";
import { MailService } from "../mail/mail.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Customer, Appointment, AppointmentDetail, Voucher, VoucherHistory])
    ],
    providers: [AppointmentSocketGateWay, AppointmentService,MailService]
})
export class SocketModule { }