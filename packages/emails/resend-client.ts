import { Resend } from "resend";

const RESEND_KEY = process.env.RESEND_KEY;

if (!RESEND_KEY) {
    throw new Error("RESEND_KEY missing. Required to send emails");
}

export const ResendClient = new Resend(RESEND_KEY);
