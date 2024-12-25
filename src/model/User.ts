import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
	content: string;
	createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
	content: {
		type: String,
		required: [true, "Content is required!"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export interface User extends Document {
	username: string;
	email: string;
	password: string;
	isVerified: boolean;
	isAcceptingMessages: boolean;
	verifyCode: string;
	VerifyCodeExipry: Date;
	messages: Message[];
}

const userSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: [true, "Username is Required!"],
		trim: true,
		lowercase: true,
	},

	email: {
		type: String,
		required: [true, "email is required ,so please enter the correct Email!"],
		unique: true,
		match: [/.+\@.+\..+/, "Please Enter the vailed Email Address!"],
	},

	password: {
		type: String,
		required: [true, "Password is must!"],
		minlength: 8,
	},

	verifyCode: {
		type: String,
		required: [true, "Verify Code is Required!"],
	},

	VerifyCodeExipry: {
		type: Date,
		required: [
			true,
			"verify code Exipry is Required, so please Enter the Exipry first!",
		],
	},
	isVerified: {
		type: Boolean,
		default: false,
	},

	isAcceptingMessages: {
		type: Boolean,
		default: true,
	},

	messages: [messageSchema],
});

const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", userSchema);

export default UserModel;
