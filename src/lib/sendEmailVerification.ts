'use server'

// import { db } from "@/firebase/config";
// import {} from 'firebase/firestore';\
import { nanoid } from "nanoid";

var nodemailer = require("nodemailer");

export async function sendMail(toEmail:string, username: string, code: string) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: 'Emailcím ellenőrző kód - Magyar Wesnoth Közösség',
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      </head>
      <body>
        <table style="background-color:#dad1a0; border-color:goldenrod;" cellpadding="10" cellspacing="10" border="4">
          <tr>
            <td><img src="cid:logo" style="width:415px;height:189px;"/></td>
          </tr>
          <tr>
            <td style="font-size:20px; text-align: center;">
              <a href='${process.env.NODEMAILER_DOMAIN_DEV}/auth/action?mode=verifyEmail&user=${username}&actionCode=${code}' style="color:darkgoldenrod;margin:10px;text-decoration:none;">
                Az ellenőrző kódod
              </a>
            </td>
            </tr>  
            <tr style="font-size:11px; text-align:center;">
              <td>
                A kód érvényessége 24 óra múlva lejár.
              </td>
            </tr>
        </table>
      </body>
    </html>`,
        attachments: [
          {
            file: 'logo-hu.png',
            path: 'https://cdn.sanity.io/images/x23r8kwf/development/89dba285b2fed4eaabcc4ac78535a64b08efbccd-415x189.png',
            cid: 'logo',
          },
        ],
  };

  transporter.sendMail(mailOptions, function (error:any, info: any) {
    if (error) {
      throw new Error(error);
    } else {
      console.log("Email Sent");
      return true;
    }
  });
}

export default async function SendEmailVerification(username: string, email: string) {
    
    const actionCode = nanoid();

    return (
        sendMail(email,username,actionCode)
    )
}
