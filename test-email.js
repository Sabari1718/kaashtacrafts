require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testMail() {
  console.log("Using Email:", process.env.EMAIL_USER);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'Test Email',
      text: 'This is a test email to verify credentials.'
    });
    console.log('Success:', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

testMail();
