import { AppError } from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';

interface MongooseError extends Error {
	name: string;
	code?: number;
	keyPattern?: Record<string, any>;
	keyValue?: Record<string, any>;
	path?: string;
	value?: any;
	errors?: Record<string, any>;
}

interface ZodError extends Error {
	name: string;
	issues: Array<{
		code: string;
		expected: string;
		received: string;
		path: string[];
		message: string;
	}>;
}

const handleZodError = (err: ZodError): AppError => {
	const errors = err.issues.map(
		(issue) => `${issue.path.join('.')}: ${issue.message}`
	);
	return new AppError(`Validation error: ${errors.join(', ')}`, 400);
};

const handleMongooseValidationError = (err: MongooseError): AppError => {
	const errors = Object.values(err.errors || {}).map((val: any) => val.message);
	const error = new AppError(`Validation failed: ${errors.join(', ')}`, 400);
	error.isOperational = true; // Mark as operational error
	return error;
};

const handleMongooseDuplicateFieldsError = (err: MongooseError): AppError => {
	const field = Object.keys(err.keyValue || {})[0];
	const value = err.keyValue?.[field];
	const error = new AppError(
		`Duplicate field value: ${field} - '${value}'. Please use another value!`,
		400
	);
	error.isOperational = true;
	return error;
};

const handleMongooseCastError = (err: MongooseError): AppError => {
	const error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
	error.isOperational = true;
	return error;
};

const handleJWTError = (): AppError => {
	const error = new AppError('Invalid token. Please log in again!', 401);
	error.isOperational = true;
	return error;
};

const handleJWTExpiredError = (): AppError => {
	const error = new AppError(
		'Your token has expired! Please log in again.',
		401
	);
	error.isOperational = true;
	return error;
};

const sendErrorDev = (err: AppError, res: Response) => {
	res.status(err.statusCode).json({
		success: false,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err: AppError, res: Response) => {
	console.log(err);
	// Operational, trusted error: send message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
	} else {
		// Programming or other unknown error: don't leak error details
		console.error('ERROR 💥', err);

		res.status(500).json({
			success: false,
			message: 'Something went wrong!',
		});
	}
};

export const errorHandler = (
	err: Error | AppError | MongooseError | ZodError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let error = { ...err };
	error.message = err.message;

	// Log error
	console.error(err);

	// Handle different error types
	if (err.name === 'ZodError') {
		error = handleZodError(err as ZodError);
	} else if (err.name === 'ValidationError') {
		error = handleMongooseValidationError(err as MongooseError);
	} else if ((err as MongooseError).code === 11000) {
		error = handleMongooseDuplicateFieldsError(err as MongooseError);
	} else if (err.name === 'CastError') {
		error = handleMongooseCastError(err as MongooseError);
	} else if (err.name === 'JsonWebTokenError') {
		error = handleJWTError();
	} else if (err.name === 'TokenExpiredError') {
		error = handleJWTExpiredError();
	}

	const appError = error as AppError;
	appError.statusCode = appError.statusCode || 500;
	appError.status = appError.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(appError, res);
	} else {
		sendErrorProd(appError, res);
	}
};
