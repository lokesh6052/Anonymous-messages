import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
	//Connection through the Database!
	await dbConnect();

	try {
		const { username, code } = await request.json();
		const decodedUsername = decodeURIComponent(username);
		const user = await UserModel.findOne({
			username: decodedUsername,
		});

		if (!user) {
			return Response.json({
				success: false,
				message: "User is not found in the database!",
			});
		}

		//Checking the verification code is correct and not yet Exipred as well.
		const verificationCodeIsValide = user.verifyCode === code;
		const verificationCodeExipryIsValide =
			new Date(user.VerifyCodeExipry) > new Date();

		//Checking the verification Code is correct or it's expiry is should not be expired!
		if (verificationCodeIsValide && verificationCodeExipryIsValide) {
			//updating the verification status in the database!
			user.isVerified = true;
			await user.save();

			return Response.json({
				success: true,
				message: "Account verification is successfully Done!",
			});

			//checking the verification code Expiry validity , if it's exipred then user was sign up again and get the new user verify code!
		} else if (!verificationCodeExipryIsValide) {
			return Response.json(
				{
					success: false,
					message:
						"Verification Code has Expired, so please sign up again and get the new code!",
				},
				{ status: 400 }
			);
		} else {
			return Response.json(
				{
					success: false,
					message: "Incorrect Verification Code!",
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("An error Ocuured while the verify-code is updating!", error);
		return Response.json(
			{
				success: false,
				message:
					"an error ocurred while the verifiction status is updating in the database!",
			},
			{
				status: 500,
			}
		);
	}
}
