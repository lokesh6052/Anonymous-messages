import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameSchema } from "@/schema/signUpSchema";

const UsernameQuerySchema = z.object({
	username: usernameSchema,
});

export async function GET(request: Request) {
	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);
		const queryParams = {
			username: searchParams.get("username"),
		};

		const result = UsernameQuerySchema.safeParse(queryParams);

		console.log(result);

		if (!result.success) {
			const usernameError = result.error.format().username?._errors || [];
			return Response.json(
				{
					success: false,
					message:
						usernameError?.length > 0
							? usernameError.join(", ")
							: "Invalid Query Params",
				},
				{
					status: 400,
				}
			);
		}
		const { username } = result.data;

		const exisitingUsernameInDatabaseWithVerification = await UserModel.findOne(
			{
				username,
				isVerified: true,
			}
		);

		if (exisitingUsernameInDatabaseWithVerification) {
			return Response.json(
				{
					success: false,
					message: "Username is already existed in the Database!",
				},
				{
					status: 200,
				}
			);
		}

		return Response.json(
			{
				success: true,
				message: "Username is Unique, it's not accured by anyone!",
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error(
			"An Error occured while checking the username uniqueness: ",
			error
		);

		return Response.json(
			{
				success: false,
				message: "An Error Occured while checking the username uniqueness",
			},
			{
				status: 500,
			}
		);
	}
}
