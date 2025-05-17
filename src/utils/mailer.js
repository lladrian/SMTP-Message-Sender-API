import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();


const sendEmail = async (email, name, message, ip) => {

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  
  const mailOptions = {
    from: `"ADR | MAN - " <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "ADR | MAN",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="text-align: center; color: #4CAF50;">Thank You for Contacting Us!</h2>
            <p style="font-size: 16px; color: #333;">Hello ${name},</p>
            <p style="font-size: 16px; color: #333;">
                Thank you for your message! We have received your submission and will get back to you as soon as possible.
            </p>
             <p style="font-size: 16px; color: #333;">
                Your message: <em>"${message}"</em>
            </p>
            <p style="font-size: 16px; color: #333;">
                If you have any urgent questions, feel free to reach out to us directly at <strong style="color: #4CAF50;">adrianmanatad5182@gmail.com</strong>.
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
           
        </div>
    `,
  };


  // Email to the admin (your email)
  const adminMailOptions = {
    from: `"ADR | MAN - " <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Admin email
    subject: "New Contact Form Submission - Web Portfolio",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="text-align: center; color: #4CAF50;">New Contact Form Submission</h2>
            <p style="font-size: 16px; color: #333;">You have received a new message from ${name}:</p>
            <p style="font-size: 16px; color: #333;"><strong>Email:</strong> ${email}</p>
              <p style="font-size: 16px; color: #333;"><strong>IP Address:</strong> ${ip}</p>
            <p style="font-size: 16px; color: #333;"><strong>Message:</strong></p>
            <p style="font-size: 16px; color: #333;">${message}</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  await transporter.sendMail(adminMailOptions);
};

export default sendEmail;
