import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDetailDto } from 'src/modules/appointment-details/dto/create-appointment-detail.dto';
import { AppointmentDetail } from 'src/modules/appointment-details/entities/appointment-detail.entity';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Voucher } from 'src/modules/vouchers/entities/voucher.entity';
import { VoucherHistory } from 'src/modules/voucher-history/entities/voucher-history.entity';
import { CreateVoucherHistoryDto } from 'src/modules/voucher-history/dto/create-voucher-history.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Customer) private customer: Repository<Customer>,
    @InjectRepository(Appointment) private appointment: Repository<Appointment>,
    @InjectRepository(AppointmentDetail)
    private appointmentDetail: Repository<AppointmentDetail>,
    @InjectRepository(VoucherHistory)
    private voucherHistory: Repository<VoucherHistory>,
    @InjectRepository(Voucher) private voucher: Repository<Voucher>,
  ) {}
  async create(
    createCustomerDto: CreateCustomerDto,
    createAppointmentDto: any,
    createAppointmentDetailDto: CreateAppointmentDetailDto[],
    voucherHistoryDto?: CreateVoucherHistoryDto,
    useVoucher?: any,
  ) {
    try {
      let customerRes;
      const findCustomer = await this.customer.findOne({
        where: {
          email: createCustomerDto.email,
        },
      });
      if (!findCustomer) {
        customerRes = await this.customer.save(createCustomerDto);
        console.log('customerRes', customerRes);
        if (!customerRes)
          return {
            status: false,
            message: 'Error al crear el cliente',
          };
        if (customerRes) {
          let formartAppointment = {
            ...createAppointmentDto,
            customerId: customerRes.id,
            voucherHistoryId: useVoucher ? useVoucher.id : null,
          };
          let appointmentRes = await this.appointment.save(formartAppointment);
          console.log('appointmentRes', appointmentRes);
          if (!appointmentRes) throw new Error('Error al crear cita');
          if (appointmentRes) {
            // chekck xem co voucher hay khong !
            if (voucherHistoryDto) {
              console.log('voucherHistoryDto', voucherHistoryDto);
              const formartVoucherHistory = {
                ...voucherHistoryDto,
                appointmentId: Number(appointmentRes.id),
                customerId: Number(customerRes.id),
              };
              // console.log("🚀 ~ file: appointment.service.ts:51 ~ AppointmentService ~ create ~ formartVoucherHistory:", formartVoucherHistory)

              let resultVoucherHistory = await this.voucherHistory.save(
                formartVoucherHistory,
              );
              console.log('resultVoucherHistory', resultVoucherHistory);
              if (resultVoucherHistory) {
                let updateVoucherUsed = {
                  ...useVoucher,
                  status: true,
                };
                let updatedVoucher = this.voucher.merge(
                  useVoucher,
                  updateVoucherUsed,
                );
                let resultUpdateVoucher =
                  await this.voucher.save(updatedVoucher);
              }
            }
            for (let i in createAppointmentDetailDto) {
              createAppointmentDetailDto[i] = {
                ...createAppointmentDetailDto[i],
                appointmentId: appointmentRes.id,
              };
            }
            let resultAppomentDetailRes = await Promise.all(
              createAppointmentDetailDto.map(
                async (detail) => await this.appointmentDetail.save(detail),
              ),
            );

            return {
              status: true,
              message: 'create booking successfull ',
              customer: customerRes,
              appoiment: appointmentRes,
              details: resultAppomentDetailRes,
            };
          }
        }
      } else {
        let formartAppointment = {
          ...createAppointmentDto,
          customerId: findCustomer.id,
          voucherHistoryId: useVoucher ? useVoucher.id : null,
        };
        let appointmentRes = await this.appointment.save(formartAppointment);
        if (!appointmentRes) throw new Error('Error al crear cita');

        if (appointmentRes) {
          // chekck xem co voucher hay khong !
          if (voucherHistoryDto) {
            console.log('voucherHistoryDto', voucherHistoryDto);
            const formartVoucherHistory = {
              ...voucherHistoryDto,
              appointmentId: Number(appointmentRes.id),
              customerId: Number(findCustomer.id),
            };
            let resultVoucherHistory = await this.voucherHistory.save(
              formartVoucherHistory,
            );
            console.log('resultVoucherHistory', resultVoucherHistory);
            if (resultVoucherHistory) {
              let updateVoucherUsed = {
                ...useVoucher,
                status: true,
              };
              let updatedVoucher = this.voucher.merge(
                useVoucher,
                updateVoucherUsed,
              );
              let resultUpdateVoucher = await this.voucher.save(updatedVoucher);
            }
          }
          for (let i in createAppointmentDetailDto) {
            createAppointmentDetailDto[i] = {
              ...createAppointmentDetailDto[i],
              appointmentId: appointmentRes.id,
            };
          }
          let resultAppomentDetailRes = await Promise.all(
            createAppointmentDetailDto.map(
              async (detail) => await this.appointmentDetail.save(detail),
            ),
          );

          return {
            status: true,
            message: 'create booking successfull ',
            customer: findCustomer,
            appoiment: appointmentRes,
            details: resultAppomentDetailRes,
          };
        }
      }

      return {
        status: true,
        message: 'create booking okey',
      };
    } catch (err) {
      console.log('err', err);

      return {
        status: false,
        message: 'Create Appointment Fail',
      };
    }
  }

  async findAll() {
    try {
      let listAppointments = await this.appointment.find({
        relations: {
          customer: true,
          appointmentDetails: {
            staff: true,
            service: true,
          },
        },
      });
      return listAppointments;
    } catch {
      return {
        status: false,
        data: null,
      };
    }
  }
  async findOne(id: number) {
    const res = await this.appointment.findOne({
      where: { id: id },
      relations: {
        appointmentDetails: {
          staff: true,
          service: true,
        },
        customer: true,
      },
    });
    return res;
  }
}
