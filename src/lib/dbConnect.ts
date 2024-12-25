import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log("connection is already established!");
		return;
	}

	try {
		const db = await mongoose.connect(process.env.MONGO_URI || "", {});
		console.log(db);
		console.log(db.connections[0]);
		console.log(db.connections[0].readyState);

		connection.isConnected = db.connections[0].readyState;
		console.log("connection is established!", connection.isConnected);
	} catch (error) {
		console.error("an error accured in the database connection: ", error);
		process.exit(1);
	}
}

export default dbConnect;
