/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credientials",
			name: "Credientials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				await dbConnect();

				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier.email },
							{ username: credentials.identifier.username },
						],
					});

					if (!user) {
						throw new Error(
							"No user found with this email or username, so please try again!"
						);
					}

					if (!user.isVerified) {
						throw new Error(
							"This email or username is not been verified yet, so please verify it first!"
						);
					}

					const isPasswordMatch = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (isPasswordMatch) {
						return user;
					} else {
						throw new Error("Password is incorrect, so please try again!");
					}
				} catch (error: any) {
					throw new Error(error.message);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
				token.username = user.username;
			}
			return token;
		},

		async session({ token, session }) {
			if (token) {
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessages = token.isAcceptingMessages;
				session.user.username = token.username;
			}
			return session;
		},
	},

	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,

	pages: {
		signIn: "/sign-in",
	},
};
