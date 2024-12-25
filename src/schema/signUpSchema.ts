import { z } from "zod";

export const usernameSchema = z
	.string()
	.min(3, "Username must be at least 3 characters Long!")
	.max(20, "Username must be at most 20 characters Long!")
	.regex(
		/^[a-zA-Z0-9_]*$/,
		"Username must contain only alphanumeric characters and underscores!"
	);

export const signUpSchema = z.object({
	username: usernameSchema,
	email: z.string().email({
		message: "Invalid email address , please enter a valid email address!",
	}),

	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters Long!" }),
});
