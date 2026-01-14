import { appConfig } from '@/config';
import app from './app';

// Start server
const server = app.listen(appConfig.port, () => {
	console.log(
		` Server running on port ${appConfig.port} in ${appConfig.nodeEnv} mode`
	);
	console.log(` API available at http://localhost:${appConfig.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
	console.error('Unhandled Promise Rejection:', err.message);
	console.error(err.stack);

	// Close server & exit process
	server.close(() => {
		process.exit(1);
	});
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
	console.error('Uncaught Exception:', err.message);
	console.error(err.stack);

	// Close server & exit process
	server.close(() => {
		process.exit(1);
	});
});

export default server;
