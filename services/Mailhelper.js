import nodemailer from "nodemailer";
const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

export const mailHelper = async ({ recepeint, subject, text }) => {
  const mailOptions = {
    from: "vm21242124@gmail.com",
    to: recepeint,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("email sent " + info.response);
    }
  });
};
