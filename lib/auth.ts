import { betterAuth, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/drizzle/index"; // fixed import path
import * as schema from "@/drizzle/db/schema";
import { nextCookies } from "better-auth/next-js";
import VerificationEmail from "@/components/emails/verification-email";
import { Resend } from "resend";
import PasswordResetEmail from "@/components/emails/reset-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", 
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "ossama.dardery@gmail.com",
        subject: "Reset your password",
        react: PasswordResetEmail({
          userName: user.name,
          resetUrl: url,
          requestTime: new Date().toISOString(),
        }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "ossama.dardery@gmail.com",
        subject: "Verify your email address",
        react: VerificationEmail({ userName: user.name, verificationUrl: url }),
      });
    },
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});
