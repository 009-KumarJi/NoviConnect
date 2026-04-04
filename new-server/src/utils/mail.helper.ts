import nodemailer from 'nodemailer';

export const sendEmailOTP = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,  // Google App Password (not your real Gmail password)
      },
    });

    const mailOptions = {
      from: `"NoviConnect" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your NoviConnect Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4A90E2; text-align: center;">NoviConnect</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">You requested a password reset. Here is your Verification Code (OTP):</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #777;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} NoviConnect. All rights reserved.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};
