import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	const tokenKey = process.env.TOKEN_KEY || '';

	jwt.verify(token, tokenKey, (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}

		req.user = user;
		next();
	});
};
