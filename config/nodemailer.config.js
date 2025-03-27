const nodemailer = require("nodemailer");
const { promisify } = require("util");

const DEV = process.env.NODE_ENV !== "production";

const mailOptions = {
  host: DEV ? "smtp.ethereal.email" : "smtp.gmail.com",
  port: DEV ? 587 : 465,
  secure: DEV ? false : true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // timeout after 10 seconds
  socketTimeout: 20000, // timeout after 20 seconds
};

const transporter = nodemailer.createTransport(mailOptions);

module.exports = promisify(transporter.sendMail.bind(transporter));
