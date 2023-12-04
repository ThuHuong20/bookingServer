import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { AppointmentStatus } from './appointment.enum';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as pdf from 'html-pdf';
import { MailService } from '../mail/mail.service';
import { createPDF } from '../createPdf/method';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly mail: MailService,
  ) {}
  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment';
  }

  async findAll() {
    const res = await this.appointmentRepository.find({
      relations: {
        appointmentDetails: {
          staff: true,
          service: true,
        },
        customer: true,
      },
    });
    if (!res)
      return {
        status: false,
        message: 'get fail ',
        data: null,
      };
    return {
      status: true,
      message: 'accept successfull ! ',
      data: res,
    };
  }

  async acceptAppointment(id: number) {
    const res = await this.appointmentRepository.findOne({
      where: { id: id },
      relations: {
        appointmentDetails: {
          staff: true,
          service: true,
        },
        customer: true,
      },
    });
    if (res.status != AppointmentStatus.PENDING) {
      return await ejs.renderFile('acceptedConfirm.ejs');
    }
    const resUpdate = this.appointmentRepository.merge(res, {
      status: AppointmentStatus.ACCEPTED,
    });
    const resResult = await this.appointmentRepository.save(resUpdate);
    console.log('resResult', resResult);

    if (!resResult)
      return {
        status: false,
        message: 'Failed to accept',
        data: null,
      };
    return {
      status: true,
      message: 'accept successfull ! ',
      data: resResult,
    };
  }

  async update(id: number) {
    const res = await this.appointmentRepository.findOne({
      where: { id: id },
      relations: {
        appointmentDetails: {
          staff: true,
          service: true,
        },
        customer: true,
      },
    });
    const resUpdate = this.appointmentRepository.merge(res, {
      status: AppointmentStatus.DONE,
    });
    const resResult = await this.appointmentRepository.save(resUpdate);

    var data = {
      customerName: resResult.customer.fullName,
      date: resResult.date,
      time: resResult.time,
      appointmentDetail: resResult.appointmentDetails,
      total: resResult.appointmentDetails.reduce(
        (acc, detail) => acc + detail.price,
        0,
      ),
    };

    // Đọc tệp EJS
    var ejsTemplate = fs.readFileSync('./pdf.ejs', 'utf8');

    // Render tệp EJS với dữ liệu
    var html = ejs.render(ejsTemplate, data);

    var options = { format: 'Letter' };

    // Tạo tệp PDF từ HTML đã được tạo ra
    await pdf
      .create(html, options)
      .toFile('./businesscard.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: './businesscard.pdf' }
      });
    // console.log("🚀 ~ file: appointments.service.ts:69 ~ AppointmentsService ~ pdf.create ~ pdf:", pdf)
    // resResult là dữ liệu đầu vào sao khi bấm thay đổi data base thành recipt
    // sau dó lam handle gửi mail kèm pdf
    this.mail.sendMail({
      to: resResult.customer.email,
      subject: 'aaa',
      html: `
      Testing Pdf Generate document, Thanks.`,
      attachments: [
        {
          filename: 'businesscard.pdf',
          contentType: 'application/pdf',
          path: './businesscard.pdf',
        },
      ],
    });
    return resResult;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }

  /*  async updateInformation(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    console.log("da vao appoint service")
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: {
          id
        },
        relations: {
          appointmentDetails: {
            service: true,
            staff: true
          },
          customer: true,
          voucher: true
        }
      });
      console.log("appointment", appointment);
      console.log("updateAppointmentDto", updateAppointmentDto);
      const updatedAppointment = this.appointmentRepository.merge(appointment, updateAppointmentDto);
      const result = await this.appointmentRepository.save(updatedAppointment);
      if (result && result.status == "DONE") {
        //gui email
        var data = {
          customerName: result.customer.fullName,
          date: result.date,
          time: result.time,
          appointmentDetail: result.appointmentDetails,
          total: result.appointmentDetails.reduce((acc, detail) => acc + detail.price, 0),
          voucherValue: (result.voucher) ? ((result.voucher.discountType == "percent") ? (result.voucher.value + "%") : ("$" + result.voucher.value)) : 0,
          apmTotal: result.total,
        };
        // Đọc tệp EJS
        if(data){
          var ejsTemplate = fs.readFileSync('./pdf.ejs', 'utf8');

        // Render tệp EJS với dữ liệu
        var html = ejs.render(ejsTemplate, data);

        var options = { format: 'Letter' };

        // Tạo tệp PDF từ HTML đã được tạo ra 
        await pdf.create(html, options).toFile('./yourReceipt.pdf', function (err, res) {
          if (err) return console.log(err);
          console.log(res); // { filename: './yourReceipt.pdf' }
        });
        console.log("🚀 ~ file: appointments.service.ts:188 ~ AppointmentsService ~ pdf:", pdf)
        // resResult là dữ liệu đầu vào sao khi bấm thay đổi data base thành recipt
        // sau dó lam handle gửi mail kèm pdf
        this.mail.sendMail({
          to: result.customer.email,
          subject: "Your Receipt - Rasm Salon",
          html: `Thanks For Your Appointment.`,
          attachments: [
            {
              filename: 'yourReceipt.pdf',
              contentType: 'application/pdf',
              path: "./yourReceipt.pdf"
            }
          ]
        });
        } 
      }

      return {
        status: true,
        data: result
      }
    } catch {
      return {
        status: false,
        data: null
      }
    }
  } */

  async updateInformation(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ) {
    console.log('da vao appoint service');
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: {
          id,
        },
        relations: {
          appointmentDetails: {
            service: true,
            staff: true,
          },
          customer: true,
          voucher: true,
        },
      });
      console.log('appointment', appointment);
      console.log('updateAppointmentDto', updateAppointmentDto);
      const updatedAppointment = this.appointmentRepository.merge(
        appointment,
        updateAppointmentDto,
      );
      const result = await this.appointmentRepository.save(updatedAppointment);

      if (result && result.status === 'DONE') {
        var data = {
          customerName: result.customer.fullName,
          date: result.date,
          time: result.time,
          appointmentDetail: result.appointmentDetails,
          total: result.appointmentDetails.reduce(
            (acc, detail) => acc + detail.price,
            0,
          ),
          voucherValue: result.voucher
            ? result.voucher.discountType === 'percent'
              ? result.voucher.value + '%'
              : '$' + result.voucher.value
            : 0,
          apmTotal: result.total,
        };

        // Tạo tệp PDF trước
        await createPDF(data);

        // Gửi email kèm tệp PDF
        this.mail.sendMail({
          to: result.customer.email,
          subject: 'Your Receipt - Rasm Salon',
          html: `Thanks For Your Appointment.`,
          attachments: [
            {
              filename: 'yourReceipt.pdf',
              contentType: 'application/pdf',
              path: './yourReceipt.pdf',
            },
          ],
        });
      }

      return {
        status: true,
        data: result,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        data: null,
      };
    }
  }
  async updateReminderEmail(id: number) {
    const oldData = await this.appointmentRepository.findOne({
      where: {
        id,
      },
    });
    if (!oldData)
      return {
        status: false,
        message: 'get appointment update faid',
        data: null,
      };
    const newData = {
      ...oldData,
      IsReminder: true,
    };

    const mergeData = this.appointmentRepository.merge(oldData, newData);
    const resultMergeData = await this.appointmentRepository.save(mergeData);
    if (!resultMergeData)
      return {
        status: false,
        message: 'get appointment update failed',
        data: null,
      };
    return {
      status: true,
      message: 'get appointment update successfull',
      data: resultMergeData,
    };
  }
}
