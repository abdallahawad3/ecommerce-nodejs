import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Nodemailer //
const sendEmail = async (options: EmailOptions) => {
  // 1) Create transportal (Serves that send email like [ gmail | mailgun | sendGrid | mailtrap ])
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your gmail
      pass: process.env.EMAIL_PASS, // app password (NOT your real password)
    },
  });
  // 2) Define email options [like (from | to | subject | email content | html Formatting )]
  await transporter.sendMail({
    from: `"E-Shop" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
};

export default sendEmail;

export const emailTemplate = (name: string, otp: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      .header {
        background: #0B150F;
        color: #ffffff;
        text-align: center;
        padding: 20px;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        padding: 30px;
        color: #333;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 20px;
        margin-top: 20px;
        background: #96EF76;
        color: #0B150F !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        padding: 20px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      
      <div class="header">
        🚀 E-Shop
      </div>

      <div class="content">
        <h2>Hello ${name} 👋</h2>

        <p>
          We received a request related to your account.
          Click the button below to continue.
        </p>

           <!-- OTP BOX -->
        <div style="
          display:inline-block;
          padding:15px 25px;
          margin:20px 0;
          font-size:28px;
          letter-spacing:8px;
          font-weight:bold;
          background:#0B150F;
          color:#96EF76;
          border-radius:8px;
          user-select:all;
        ">
          ${otp}
        </div>

        <p style="margin-top:20px;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} E-Shop. All rights reserved.
      </div>

    </div>
  </body>
  </html>
  `;
};
