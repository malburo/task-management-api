import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'tasker.malburo@gmail.com',
    pass: 'Sieunhan1',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (emailList, subject) => {
  try {
    const to = emailList.join(', ');
    console.log({ to, subject });
    await transporter.sendMail({
      from: 'Task management system',
      to: 'vickyvuvo@gmail.com',
      subject,
      text: 'Your task is about to expire',
      html: `
      <div style="text-align: left">
      <div style="padding-right: 30px; padding-left: 30px">
        <h1>Your task is about to expire</h1>
        <div style="margin-bottom: 18px">
          <div style="margin-bottom: 1.5rem">
            <table style="width: 100%">
              <tbody>
                <tr style="width: 100%">
                  <td style="width: 100%">
                    <span
                      style="display: inline-block; border-radius: 4px; background-color: #611f69"
                      class="m_-4940711398517534128button_link_wrapper m_-4940711398517534128plum"
                      ><a
                        class="m_-4940711398517534128button_link m_-4940711398517534128plum"
                        href="http://localhost:3000/boards/6288bb8e32ad21069fa65022/tasks/6288c2a132ad21069fa651ac"
                        style="
                          border-top: 13px solid;
                          border-bottom: 13px solid;
                          border-right: 24px solid;
                          border-left: 24px solid;
                          border-color: #611f69;
                          border-radius: 4px;
                          background-color: #611f69;
                          color: #ffffff;
                          font-size: 16px;
                          line-height: 18px;
                          word-break: break-word;
                          display: inline-block;
                          text-align: center;
                          font-weight: 900;
                          text-decoration: none !important;
                        "
                        target="_blank"
                        >Go to your task</a
                      >
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
    });
  } catch (error) {
    console.log(error);
  }
};
