"use server";

import connectDB from "@/db/connectDB";
import { User } from "@/db/models/user.model";
import signUpSchema from "@/lib/zod/signupSchema";
import { z } from "zod";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation";
import { resetSchema } from "@/lib/zod/resetSchema";
import loginSchema from "@/lib/zod/loginSchema";
import { auth, signIn } from "@/auth";
import cloudinary from "@/lib/cloudinary";

let forgotCode: number;

export const login = async (data: z.infer<typeof loginSchema>) => {
  try {
    const validatedData = await loginSchema.safeParse(data);

    if (validatedData.error) {
      return {
        ok: false,
        error: validatedData.error.message || "credentials are not valid"
      }
    }

    await connectDB();

    const user = await User.findOne({ email: validatedData.data.email });

    if (!user) {
      return {
        ok: false,
        error: "User not found"
      }
    }

    const isMatch = await bcrypt.compare(validatedData.data.password, user.password);

    if (!isMatch) {
      return {
        ok: false,
        error: "Invalid Credentials"
      }
    }

    console.log('User found:', user);

    await signIn("credentials", { ...validatedData.data, redirect: false, callbackUrl: "/" });

    return {
      ok: true,
      user: {
        ...user.toObject(),
        password: undefined
      }
    }

  } catch (error) {
    console.error("Error while connecting to database", error);
  }
};

export const signup = async (data: z.infer<typeof signUpSchema>) => {
  try {

    const validatedData = signUpSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        ok: false,
        error: validatedData.error.message || "credentials are not valid"
      }
    }

    await connectDB();

    const existingUser = await User.findOne({ email: validatedData.data.email });

    if (existingUser) {
      return {
        ok: false,
        error: "Email already exists"
      }
    }

    const hashedPassword = await bcrypt.hash(validatedData.data.password, 10);

    const user = await User.create({
      name: validatedData.data.name,
      email: validatedData.data.email,
      password: hashedPassword
    });

    return {
      ok: true,
      user: {
        ...user.toObject(),
        password: undefined
      }
    }
  } catch (error) {
    console.error("Error while Creating user", error)
    return {
      ok: false,
      error: "Signup failed"
    }
  }
}

export const logout = async (callbackUrl: string) => {
  await fetch(`${process.env.NEXTAUTH_URL}/api/auth/logout`);
  return redirect(callbackUrl);
}

export const forgot = async ({ email }: { email: string }) => {
  try {
    await connectDB();
    const user = await User.findOne({ email: email });
    if (!user) {
      return {
        ok: false,
        error: "User not found"
      }
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    forgotCode = code;
    console.log("Generated Reset Code:", code);

    const sub = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Get Code</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; text-align: center;">
        <div style="max-width: 500px; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: auto;">
            <h2 style="color: #333;">Get Code</h2>
            <p style="color: #555;">We received a request to get code for your account.</p>
            <p style="font-size: 16px; font-weight: bold; color: #ff5733;">Your reset code: 
                <span style="background-color: #f8d7da; padding: 5px 10px; border-radius: 5px;">${code}</span>
            </p>
            <p style="color: #555; margin-top: 20px;">This code will expire in <strong>5 days</strong>. Do not share this email with anyone.</p>
            <p style="font-size: 14px; color: #777;">If you did not request this password reset, you can ignore this email.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #777;">© 2025 Chatty. All Rights Reserved.</p>
        </div>
    </body>
    </html>`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASS
      }
    });
    const mailOptions = {
      from: `"EntreFlow" <${process.env.MAIL_EMAIL}>`, // Change the sender's name
      to: email,
      subject: "Get Your Code",
      html: sub
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error while sending email:", error);
        return {
          ok: false,
          error: "Forgot password request failed"
        }
      }
      console.log("Email sent: " + info.response);
    });
    return {
      ok: true,
      code
    }
  } catch (error) {
    console.error("Error in forgot:", error);
    return {
      ok: false,
      error: "Forgot password request failed"
    }
  }
}

export const verifyForgot = async (verificationCode: number) => {
  if (Number(verificationCode) === Number(forgotCode)) {
    return {
      ok: true
    }
  } else {
    return {
      ok: false,
      error: "Enter correct code"
    }

  }
}

export const reset = async (data: { email: string; password: string; confirm: string }) => {
  try {
    const validatedData = resetSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        ok: false,
        error: validatedData.error.message || "credentials are not valid"
      }
    }


    await connectDB();
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return {
        ok: false,
        error: "User not found"
      }
    }
    if (data.password !== data.confirm) {
      return {
        ok: false,
        error: "Passwords do not match"
      }
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await User.updateOne({ email: data.email }, {
      password: hashedPassword
    });
    return {
      ok: true
    }
  } catch (error) {
    console.error("Error in reset:", error);
    return {
      ok: false,
      error: "Reset password failed"
    }
  }
}

export const updateProfile = async (image: string) => {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
        error: "Not Authenticated"
      }
    }
    const data = session.user;

    const uploadResponce = await cloudinary.uploader.upload(image);
    const profileImage = uploadResponce.secure_url;

    await connectDB();
    await User.updateOne({ _id: data._id }, {
      name: data.name,
      profileImage,
    });
    return {
      ok: true
    }
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return {
      ok: false,
      error: "Profile update failed"
    }
  }
}