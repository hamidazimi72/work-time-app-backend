import jwt from 'jsonwebtoken';

import { ServerResponse } from '../../utils/index.js';

export const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	const tokenKey = process.env.TOKEN_KEY || '';

	if (!token)
		return ServerResponse(res, {
			success: false,
			statusCode: 401,
			message: 'Unauthorized',
		});

	jwt.verify(token, tokenKey, (err, user) => {
		if (err) {
			return ServerResponse(res, {
				success: false,
				statusCode: 401,
				message: 'Unauthorized',
			});
		}

		req.user = user;
		next();
	});
};
