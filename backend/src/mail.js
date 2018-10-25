const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const makeANiceEmail = text => `
  <div style="
    border: 1px solid black;
    padding: 20px;
    text-align: center;
    font-size: 20px;
    line-height: 2;
    font-family: sans-serif;
    ">
    <h2>Hello There!</h2>
    <p>${text}</p>
    <p>If you did not request a password reset, ignore this email.</p>
  </div>
`;

exports.transport = transport;
exports.makeANiceEmail = makeANiceEmail;