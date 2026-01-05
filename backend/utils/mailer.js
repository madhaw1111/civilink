const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  }
});

exports.sendOTP = async (to, otp) => {
  await transporter.sendMail({
    from: `"Civilink Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Civilink OTP",
    html: `
      <h2>Verify your account</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `
  });
};
