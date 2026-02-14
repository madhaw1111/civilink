const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  }
});

exports.sendEmail = async ({ to, subject, text, html }) => {
  await transporter.verify();

  await transporter.sendMail({
    from: `"Civilink" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    text,
    html
  });
};
