import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { AppointmentDetail } from '../appointment-details/entities/appointment-detail.entity';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { CreateAppointmentDetailDto } from '../appointment-details/dto/create-appointment-detail.dto';
import { VoucherHistory } from '../voucher-history/entities/voucher-history.entity';
import { CreateVoucherHistoryDto } from '../voucher-history/dto/create-voucher-history.dto';
import { Voucher } from '../vouchers/entities/voucher.entity';
import { PaginationDto } from './dto/pagination-customer.dto';
import { AppointmentStatus } from '../appointments/appointment.enum';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customersSer: Repository<Customer>,
    @InjectRepository(Appointment)
    private appoimentSer: Repository<Appointment>,
    @InjectRepository(AppointmentDetail)
    private appoimentDetailSer: Repository<AppointmentDetail>,
    @InjectRepository(VoucherHistory)
    private voucherHistorySer: Repository<VoucherHistory>,
    @InjectRepository(Voucher) private voucherSer: Repository<Voucher>,
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
      const findCustomer = await this.customersSer.findOne({
        where: {
          email: createCustomerDto.email,
        },
      });
      if (!findCustomer) {
        customerRes = await this.customersSer.save(createCustomerDto);
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
          };
          let appointmentRes = await this.appoimentSer.save(formartAppointment);
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
              let resultVoucherHistory = await this.voucherHistorySer.save(
                formartVoucherHistory,
              );
              console.log('resultVoucherHistory', resultVoucherHistory);
              if (resultVoucherHistory) {
                let updateVoucherUsed = {
                  ...useVoucher,
                  status: true,
                };
                let updatedVoucher = this.voucherSer.merge(
                  useVoucher,
                  updateVoucherUsed,
                );
                let resultUpdateVoucher =
                  await this.voucherSer.save(updatedVoucher);
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
                async (detail) => await this.appoimentDetailSer.save(detail),
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
        };
        let appointmentRes = await this.appoimentSer.save(formartAppointment);
        console.log('appointmentRes', appointmentRes);
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
            let resultVoucherHistory = await this.voucherHistorySer.save(
              formartVoucherHistory,
            );
            console.log('resultVoucherHistory', resultVoucherHistory);
            if (resultVoucherHistory) {
              let updateVoucherUsed = {
                ...useVoucher,
                status: true,
              };
              let updatedVoucher = this.voucherSer.merge(
                useVoucher,
                updateVoucherUsed,
              );
              let resultUpdateVoucher =
                await this.voucherSer.save(updatedVoucher);
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
              async (detail) => await this.appoimentDetailSer.save(detail),
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

      return {
        status: true,
        message: 'create booking okey',
      };
    } catch (err) {
      console.log('err', err);

      return {
        status: false,
        message: 'faild',
      };
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      let listCustomers = await this.customersSer.find({
        where: {
          //IsDelete: false,
          appointments: {
            status: AppointmentStatus.DONE,
          },
        },
        relations: {
          appointments: {
            appointmentDetails: {
              service: true,
              staff: true,
            },
            voucher: true,
          },
        },
        skip: pagination.skip,
        take: pagination.take,
      });

      let countItem = (
        await this.customersSer.find({
          where: {
            appointments: {
              status: AppointmentStatus.DONE,
            },
          },
        })
      ).length;
      let maxPage = Math.ceil(countItem / pagination.take);
      return {
        message: 'successful',
        data: listCustomers,
        maxPage,
      };
    } catch (err) {
      console.log('loi model findAll ~ err:', err);
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST);
    }
  }

  async findCustomer() {
    try {
      let listCustomer = await this.customersSer.find({
        where: {
          IsDelete: false,
          appointments: {
            status: AppointmentStatus.DONE,
          },
        },
        relations: {
          appointments: {
            appointmentDetails: {
              service: true,
              staff: true,
            },
            voucher: true,
          },
        },
      });
      return {
        message: 'successful',
        data: listCustomer,
      };
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST);
    }
  }

  async searchByEmail(email: string) {
    try {
      let customer = await this.customersSer.find({
        where: {
          IsDelete: false,
          email: ILike(`%${email}%`),
          appointments: {
            status: AppointmentStatus.DONE,
          },
        },
        relations: {
          appointments: {
            appointmentDetails: {
              service: true,
              staff: true,
            },
            voucher: true,
          },
        },
      });
      return {
        data: customer,
        message: 'Get service successfully',
      };
    } catch (err) {
      console.log('err111111:', err);
      throw new HttpException('Loi Model', HttpStatus.BAD_REQUEST);
    }
  }
}
