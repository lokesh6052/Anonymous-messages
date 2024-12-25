import { Resend } from "resend";

export const resend = new Resend(process.env.RENDER_API_KEY);
