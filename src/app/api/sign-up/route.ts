import { sendverificationEmail } from "@/helper/sendVerificationEmail";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export default async function POST(request: Request) {
	// connecting to the database
	await dbConnect();
	try {
		// getting the request through the user from body
		const { username, email, password } = await request.json();

		//checking if the user is already exist with the email and it was verified
		const existingUserIsVerifiedByEmail = await UserModel.findOne({
			email,
			isVerified: true,
		});

		if (existingUserIsVerifiedByEmail) {
			return Response.json(
				{
					success: false,
					message: "User is already exist with this email and it was verified!",
				},
				{
					status: 400,
				}
			);
		}

		//checking if the user is already exist with the email and it was not verified
		const exisitingUserbyEmail = await UserModel.findOne({
			email,
		});
		const verifiedCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (exisitingUserbyEmail) {
			//checking if the user is already exist with the email and it was verified also
			if (exisitingUserbyEmail.isVerified) {
				return Response.json(
					{
						success: false,
						message:
							"User is already exist with this email and it was verified!",
					},
					{
						status: 400,
					}
				);
			}

			//checking if the user is already exist with the email and it was not verified
			else {
				const hashedPassword = await bcrypt.hash(password, 10);
				exisitingUserbyEmail.password = hashedPassword;
				exisitingUserbyEmail.verifyCode = verifiedCode;
				exisitingUserbyEmail.VerifyCodeExipry = new Date(Date.now() + 3600000);
				await exisitingUserbyEmail.save();
			}
		}

		//creating the new user if the user is not exist with the email
		else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const VerifyCodeExipry = new Date();
			VerifyCodeExipry.setHours(VerifyCodeExipry.getHours() + 1);

			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode: verifiedCode,
				VerifyCodeExipry: VerifyCodeExipry,
				isVerified: false,
				isAcceptingMessages: true,
				messages: [],
			});

			await newUser.save();
		}

		//sending the email verification code to the user for  verification

		const emailResponse = await sendverificationEmail(
			email,
			username,
			verifiedCode
		);

		if (!emailResponse.success) {
			return Response.json(
				{
					success: false,
					message:
						"Error occured when sending the email verification code to the user!",
				},
				{
					status: 500,
				}
			);
		}

		return Response.json(
			{
				success: true,
				message: "User is been created successfully, please verify your email!",
			},
			{
				status: 201,
			}
		);
	} catch (error) {
		console.error("Error  occured when the user is been creating!", error);
		return Response.json(
			{
				success: false,
				message: "Error occured when the user is been creating!",
			},
			{
				status: 500,
			}
		);
	}
}
