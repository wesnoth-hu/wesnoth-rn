var nodemailer = require("nodemailer");

export async function sendMailNotification(toEmail:string, username: string, code: string) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    });
  
    
  
    var mailOptions = {
      from: "ciocanpa87@gmail.com",
      to: process.env.NODEMAILER_EMAIL,
      subject: 'Emailcím ellenőrző kód - Magyar Wesnoth Közösség',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        </head>
        <body>
          <div>Email Verification Code sent to ${username} at the email: ${toEmail} with the code of ${code}</div>
        </body>
      </html>`
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