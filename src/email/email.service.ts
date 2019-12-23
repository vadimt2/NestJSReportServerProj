import * as nodemailer from "nodemailer";
import { Injectable } from '@nestjs/common';
import appconfig from "../config/appconfig";


@Injectable()
export class EmailService {

    constructor() { }

    async sendMail(to: string, subject: string, message: string) {
        let mailOptions = {
            from: "vadimt2@gmail.com",
            to: to,
            subject: subject,
            html: message,

      
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: appconfig.mail.user,
                pass: 'mxqwajeeumcfmqkg' 
              },
            tls: {
                rejectUnauthorized: false
            }
        });


        console.log(mailOptions);

        await transporter.sendMail(mailOptions);
    }


}
