import mongoose from 'mongoose';

interface DatabaseConfig {
	uri: string;
	options: mongoose.ConnectOptions;
}

const databaseConfig: DatabaseConfig = {
	uri: `mongodb://localhost:27017/office_eq`,
	options: {
		// MongoDB connection options
		maxPoolSize: 10,
		serverSelectionTimeoutMS: 5000,
		socketTimeoutMS: 45000,
		bufferCommands: false,
	},
};

export const connectDB = async (): Promise<void> => {
	try {
		const conn = await mongoose.connect(
			databaseConfig.uri,
			databaseConfig.options
		);

		console.log(`MongoDB Connected: ${conn.connection.host}`);

		// Handle connection events
		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB disconnected');
		});

		mongoose.connection.on('reconnected', () => {
			console.log('MongoDB reconnected');
		});

		// Graceful shutdown
		process.on('SIGINT', async () => {
			await mongoose.connection.close();
			console.log('MongoDB connection closed due to app termination');
			process.exit(0);
		});
	} catch (error) {
		console.error('Database connection error:', error);
		process.exit(1);
	}
};

export default databaseConfig;
