const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  }
});

module.exports = async function sendAdminApplyMail(user) {
  await transporter.sendMail({
    from: `"Civilink Verification" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "📝 New Professional Verification Request",
    html: `
      <h3>New Verification Request</h3>
      <p><b>Name:</b> ${user.name}</p>
      <p><b>Email:</b> ${user.email}</p>
      <p><b>Profession:</b> ${user.profession}</p>
      <p>Please review in Admin Panel.</p>
    `
  });
};
