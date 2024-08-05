import jwt from 'jsonwebtoken';

import { ServerResponse } from '../../utils/index.js';

export const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	const secretKey = process.env.JWT_SECRET_KEY || '';

	if (!token)
		return ServerResponse.json(res, {
			success: false,
			statusCode: 401,
			message: 'Unauthorized',
		});

	jwt.verify(token, secretKey, (err, tokenData) => {
		if (err) {
			return ServerResponse.json(res, {
				success: false,
				statusCode: 401,
				message: 'Unauthorized',
			});
		}

		req.tokenData = tokenData;
		next();
	});
};

export const authenticateAdminToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	const secretKey = process.env.JWT_SECRET_KEY || '';

	if (!token)
		return ServerResponse.json(res, {
			success: false,
			statusCode: 401,
			message: 'Unauthorized',
		});

	jwt.verify(token, secretKey, (err, tokenData) => {
		if (err) {
			return ServerResponse.json(res, {
				success: false,
				statusCode: 401,
				message: 'Unauthorized',
			});
		}

		if (tokenData?.role !== 'admin')
			return ServerResponse(res, {
				success: false,
				statusCode: 403,
				message: 'notAccess',
			});

		req.tokenData = tokenData;
		next();
	});
};
