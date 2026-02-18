require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Neo Bank System" <${process.env.EMAIL_USER}>`, 
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Neo Bank System';
    const text = `Hello ${name}, \n\n Thank you for registering at Neo Bank system, We're excited to have you on board\n\n Best Regards,\, The Neo Bank System Team`
    const html = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px;">
    
    <h2 style="color: #1a73e8; margin-top: 0;">
      Welcome to Neo Bank System
    </h2>

    <p style="font-size: 16px; color: #333;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      Thank you for registering at Neo Bank System. 
      We're excited to have you on board!
    </p>

    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      You can now access your account and enjoy our secure banking services.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

    <p style="font-size: 14px; color: #888;">
      Best Regards,<br/>
      <strong>Chinmay Ihare</strong>
      <strong>The Neo Bank System Team</strong>
    </p>

  </div>
</div>
`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful!';
    const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Backend Ledger Team`;
const html = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px;">
    
    <h2 style="color: #188038; margin-top: 0;">
      Transaction Successful ✅
    </h2>

    <p style="font-size: 16px; color: #333;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      Great news! Your recent transaction has been completed successfully.
    </p>

    <div style="background-color: #e6f4ea; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0; font-size: 15px; color: #137333;">
        <strong>Transaction Details:</strong><br/>
        Amount: <strong>$${amount}</strong><br/>
        Recipient Account: <strong>${toAccount}</strong>
      </p>
    </div>

    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      Thank you for banking with us. If you did not authorize this transaction, please contact our support team immediately.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

    <p style="font-size: 14px; color: #888;">
      Best Regards,<br/>
      <strong>Chinmay Ihare</strong><br/>
      <strong>The Neo Bank System Team</strong>
    </p>

  </div>
</div>
`;


    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed';
    const text = `Hello ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe Backend Ledger Team`;
const html = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px;">
    
    <h2 style="color: #d93025; margin-top: 0;">
      Transaction Failed ❌
    </h2>

    <p style="font-size: 16px; color: #333;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      We regret to inform you that your recent transaction could not be completed.
    </p>

    <div style="background-color: #fce8e6; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0; font-size: 15px; color: #b3261e;">
        <strong>Transaction Details:</strong><br/>
        Amount: <strong>$${amount}</strong><br/>
        Recipient Account: <strong>${toAccount}</strong>
      </p>
    </div>

    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      Please verify the account details and try again. 
      If the issue persists, contact our support team for assistance.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

    <p style="font-size: 14px; color: #888;">
      Best Regards,<br/>
      <strong>Chinmay Ihare</strong><br/>
      <strong>The Neo Bank System Team</strong>
    </p>

  </div>
</div>
`;


    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};