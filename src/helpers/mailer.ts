import { Resend } from "resend";
import { Trash, User as LucidUser } from "lucide-react";
import { Html } from "next/document";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType == "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType == "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgetPasswordToken: hashedToken,
        forgetPasswordExpiry: Date.now() + 3600000,
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "581068644d0231",
        pass: "7f6532f2c625f7",
      },
    });

    const mailOptions = {
      from: "sushil@sushil.ai",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <p>
          Click <a href="${
            process.env.DOMAIN
          }/verifyemail?token=${hashedToken}">
          here
          </a> to ${
            emailType === "VERIFY" ? "verify your email" : "reset your password"
          } 
          or copy the link below to your browser.<br />
          ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>
      `,
    };

    const resend = new Resend("re_xxxxxxxxx");

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "hello world",
      html: "<p>it works!</p>",
    });

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error("Error sending email: " + error.message);
  }
};
