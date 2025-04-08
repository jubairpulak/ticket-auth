import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class SignupMail {
	// private transporter: nodemailer.Transporter;
	// constructor() {
	//   // Initialize the transporter with environment variables
	//   this.transporter = nodemailer.createTransport({
	//     // host: process.env.EMAIL_HOST,
	//     port:  process.env.EMAIL_PORT ,
	//     secure: false,
	//     auth: {
	//       user: process.env.EMAIL_USERNAME,
	//       pass: process.env.EMAIL_PASS,
	//     },
	//     tls:  true,
	//   });
	//   this.transporter.verify((error, success) => {
	//     if (error) {
	//       console.error('SMTP Connection Error:', error);
	//     } else {
	//       console.log('SMTP Server is ready to take messages:', success);
	//     }
	//   });
	// }
	// async sendMail(options: {
	//   email: string;
	//    name: string;
	//   company_name: string;
	//   message: string;
	// }): Promise<void> {
	//   const mailOptions = {
	//     from: "noreply@sheba-business.com",
	//     to: "jubairpulak77@gmail.com",
	//     subject: "work",
	//     text: "work",
	//     html: `
	//     <!DOCTYPE html>
	//     <html lang="en">
	//       <head>
	//         <meta charset="UTF-8" />
	//         <meta name="viewport" content="width=device-width,initial-scale=1" />
	//         <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet" />
	//         <style>
	//           body {
	//             background: #ddd;
	//           }
	//           .email-template-main-wrap {
	//             min-height: 96.4vh;
	//             margin: 0px auto;
	//             padding: 15px 30px;
	//             width: 700px;
	//             background-color: #fff;
	//           }
	//           table,
	//           td,
	//           div,
	//           h1,
	//           p {
	//             font-family: 'Lexend';
	//             font-size: 17px;
	//             color: #454545;
	//           }
	//           b {
	//             color: #27364c !important;
	//             font-size: 24px;
	//           }
	//           a {
	//             text-decoration: none;
	//             color: #0052cc;
	//           }
	//         </style>
	//       </head>
	//       <body>
	//         <div class="email-template-main-wrap">
	//           <table>
	//             <tr>
	//               <td>
	//                 <b style="font-size: 18px; display: block;">Dear ${options.name},</b>
	//                 <div style="font-size: 14px; margin-bottom: 10px;">
	//                 </div>
	//               </td>
	//             </tr>
	//             <tr>
	//               <td>
	//                 <div style="font-size: 14px;">Best regards -</div>
	//                 <b style="font-size: 14px; display: block;">HR Team</b>
	//               </td>
	//             </tr>
	//             <tr>
	//               <td>
	//                 <br />
	//                 <a href="${options.message}" target="_blank">YOUR OTP : ${options.message}</a>
	//               </td>
	//             </tr>
	//             <tr
	//               <td>
	//                 <p style="color: #9a9a9a; margin-top: 15px;">
	//                   **This is an automatically generated email, please do not reply**
	//                 </p>
	//               </td>
	//             </tr>
	//           </table>
	//         </div>
	//       </body>
	//     </html>`,
	//   };
	//   try {
	//     await this.transporter.sendMail(mailOptions);
	//     console.log('Email sent successfully.');
	//   } catch (error) {
	//     console.error('Error sending email:', error);
	//   }
	// }
}
