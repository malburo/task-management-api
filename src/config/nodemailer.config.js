import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'tongquocbao0606@gmail.com',
    pass: 'Sieunhan',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (emailList, subject) => {
  try {
    const to = emailList.join(', ');
    await transporter.sendMail({
      from: 'Task management system',
      to,
      subject,
      text: 'Hello world?',
      html: `
      <div style="padding: 10px; background-color: #003375">
          <div style="padding: 10px; background-color: white;">
              <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
              <span style="color: black">Đây là mail test</span>
          </div>
      </div>
  `, // html body
    });
  } catch (error) {
    console.log(error);
  }
};
