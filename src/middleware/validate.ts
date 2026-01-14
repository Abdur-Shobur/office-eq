import { ValidationError } from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Validate the request structure that the schema expects
			const requestData = {
				body: req.body,
				params: req.params,
				query: req.query,
			};

			const validatedData = await schema.parseAsync(requestData);

			// Update request with validated data
			if (validatedData.body !== undefined) req.body = validatedData.body;
			if (validatedData.params !== undefined) req.params = validatedData.params;
			if (validatedData.query !== undefined) req.query = validatedData.query;

			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const validationError = new ValidationError(
					error.issues
						.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
						.join(', ')
				);
				next(validationError);
			} else {
				next(error);
			}
		}
	};
};
