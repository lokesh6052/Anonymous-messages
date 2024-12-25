import { resend } from "@/lib/resend";
import VerificationEmail from "../../Emails/verificationEmail";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendverificationEmail(
	email: string,
	username: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {
		await resend.emails.send({
			from: "dev@hiteshchoudhary.com",
			to: email,
			subject: "Anonymous Message Verification Code",
			react: VerificationEmail({ username, otp: verifyCode }),
		});

		return {
			success: true,
			message: "email verification code sent successFully!",
		};
	} catch (emailError) {
		console.error(
			"Error occured ,when sending the email verification code! ->",
			emailError
		);
		return {
			success: false,
			message: "Error occured ,when sending the email verification code!",
		};
	}
}
