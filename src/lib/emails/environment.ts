import { z } from 'zod';

export const RESEND_KEY = z
  .string({
    required_error: 'RESEND_KEY missing. Required to send emails',
  })
  .parse(process.env.RESEND_KEY);
