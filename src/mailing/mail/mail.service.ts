/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: '',
            pass: '',
        },
    });
  }

  async sendMail(recipient: string, subject: string, htmlContent: string) {
    try {
      await this.transporter.sendMail({
        from: 'gestiondestock123@gmail.com',
        to: recipient,
        subject: subject,
        html: htmlContent,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
