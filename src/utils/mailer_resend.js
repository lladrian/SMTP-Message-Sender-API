import dotenv from 'dotenv';
import { Resend } from 'resend';


dotenv.config();


const sendEmail = async (email, name, message, ip) => {

    const resend = new Resend('re_26mSiLNn_NqQqfLbPqWpjE8bdyPv3zWzs'); 
       // from: `"ADR | MAN - " <${process.env.EMAIL_USER}>`,

    //const fromAddress = process.env.EMAIL_USER || 'onboarding@resend.dev';
   const fromAddress =  'onboarding@resend.dev';
   // from: fromAddress,

  // // Email to the user
  // const userEmail = await resend.emails.send({
  //   from: `"ADR | MAN - " <${fromAddress}>`,
  //   to: email,
  //   subject: "ADR | MAN",
  //   html: `
  //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
  //         <h2 style="text-align: center; color: #4CAF50;">Thank You for Contacting Us!</h2>
  //         <p style="font-size: 16px; color: #333;">Hello ${name},</p>
  //         <p style="font-size: 16px; color: #333;">Thank you for your message! We will get back to you as soon as possible.</p>
  //         <p style="font-size: 16px; color: #333;">Your message: <em>"${message}"</em></p>
  //         <p style="font-size: 16px; color: #333;">If urgent, email <strong style="color: #4CAF50;">adrianmanatad5182@gmail.com</strong>.</p>
  //         <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
  //     </div>
  //   `
  // });

      // Email to the admin
  // const adminEmail = await resend.emails.send({
  //   from: `"ADR | MAN - " <${fromAddress}>`,
  //   to: process.env.EMAIL_USER,
  //   subject: "New Contact Form Submission - Web Portfolio",
  //   html: `
  //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
  //         <h2 style="text-align: center; color: #4CAF50;">New Contact Form Submission</h2>
  //         <p><strong>Email:</strong> ${email}</p>
  //         <p><strong>IP Address:</strong> ${ip}</p>
  //         <p><strong>Message:</strong> ${message}</p>
  //         <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
  //     </div>
  //   `
  // });


  const userEmail = await resend.emails.send({
  from: fromAddress, // Resend uses sender name separately; avoid embedding name in <>
  to: email,
  subject: "Thank you for contacting ADR | MAN!",
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Contact Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Thank You for Contacting Us!</h2>
        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 16px;">
          Thank you for reaching out to <strong>ADR | MAN</strong>. We've received your message and will get back to you shortly.
        </p>
        <p style="font-size: 16px;"><strong>Your message:</strong></p>
        <blockquote style="font-size: 16px; margin: 10px 0; padding-left: 15px; border-left: 3px solid #4CAF50;">
          ${message}
        </blockquote>
        <p style="font-size: 16px;">
          For urgent concerns, feel free to email us directly at 
          <a href="mailto:adrianmanatad5182@gmail.com" style="color: #4CAF50;">adrianmanatad5182@gmail.com</a>.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 14px; text-align: center; color: #999;">
          &copy; ${new Date().getFullYear()} ADR | MAN. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `
});

// Email to the admin
const adminEmail = await resend.emails.send({
  from: fromAddress, // Don't wrap name in <>, Resend handles "From Name" via verified sender
  to: process.env.EMAIL_USER,
  subject: "🚨 New Contact Form Submission – Web Portfolio",
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>New Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">📩 New Contact Form Submission</h2>
        
        <p style="font-size: 16px;"><strong>Sender Email:</strong> ${email}</p>
        <p style="font-size: 16px;"><strong>IP Address:</strong> ${ip}</p>
        <p style="font-size: 16px;"><strong>Submitted Message:</strong></p>
        <blockquote style="font-size: 16px; margin: 10px 0; padding-left: 15px; border-left: 3px solid #4CAF50;">
          ${message}
        </blockquote>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">

        <p style="font-size: 14px; text-align: center; color: #999;">
          ADR | MAN Portfolio Notification • ${new Date().toLocaleDateString()}
        </p>
      </div>
    </body>
    </html>
  `
});





  return { userEmail, adminEmail };
};

export default sendEmail;