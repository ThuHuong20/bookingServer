import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface MailOption {
    to: string, // Người nhận
    subject: string, // Chủ Đề
    html?: string, // Template HTML
    text?: string // Văn Bản
    attachments?: any
}

// import emailConfirm from './templates/emailConfirm'
import reminderEmail from './templates/reminderEmail';
// import sendOtp from './templates/sendOtp'
export const templates = {
    // emailConfirm,
    reminderEmail,
}

@Injectable()
export class MailService {
    async sendMail(mailOption: MailOption) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MS_USER,
                    pass: process.env.MS_PW
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            await transporter.sendMail({
                from: process.env.MS_USER,
                ...mailOption
            });

            console.log("wmail");

            return true
        } catch (err) {

            return false
        }
    }
}