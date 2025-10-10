import { Resend } from "resend"

import { authEnv } from "@/lib/env"

const resend = new Resend(authEnv.resendApiKey)

interface SendPasswordResetEmailParams {
  email: string
  resetUrl: string
  userName?: string
}

interface SendVerificationEmailParams {
  email: string
  verificationUrl: string
  userName?: string
}

export async function sendPasswordResetEmail({
  email,
  resetUrl,
  userName = "User",
}: SendPasswordResetEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@anveio.com",
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
          <p>To reset your password, click the button below:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007cba; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>Best regards,<br>The Anveio Team</p>
        </div>
      `,
    })

    if (error) {
      console.error("Failed to send password reset email:", error)
      throw new Error("Failed to send password reset email")
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw error
  }
}

export async function sendVerificationEmail({
  email,
  verificationUrl,
  userName = "User",
}: SendVerificationEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@anveio.com",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email Address</h2>
          <p>Hello ${userName},</p>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">Verify Email</a>
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>Best regards,<br>The Anveio Team</p>
        </div>
      `,
    })

    if (error) {
      console.error("Failed to send verification email:", error)
      throw new Error("Failed to send verification email")
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending verification email:", error)
    throw error
  }
}