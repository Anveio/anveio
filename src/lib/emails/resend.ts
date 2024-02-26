import { Resend } from 'resend';
import { RESEND_KEY } from './environment';

export const ResendClient = new Resend(RESEND_KEY);
