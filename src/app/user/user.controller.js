import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import { ServerResponse, FS } from '../../utils/index.js';

import { __filename_db_user } from '../../db/config.js';

const tokenKey = process.env.TOKEN_KEY || '';
const registerKey = process.env.REGISTER_KEY || '';

export class User {
	static functions = {
		readAllRecords: () => {
			const { data, err } = FS.readFileSync(__filename_db_user);
			if (err) return null;
			else return JSON.parse(data || '{}') || {};
		},
	};

	static login = async (req, res, next) => {
		const username = req?.params?.username || '';
		const password = req?.body?.password;

		const records = User.functions.readAllRecords() || {};
		const user = records[username] || null;

		if (!user)
			return ServerResponse.json(res, {
				success: false,
				message: 'User Not Found',
				body: { info: null },
			});

		const isValidPassword = bcrypt.compareSync(password, user.password);

		if (!isValidPassword)
			return ServerResponse.json(res, {
				success: false,
				message: 'Password Wrong',
				body: { info: null },
			});

		const token = jwt.sign({ username: user.username }, tokenKey, { expiresIn: '24h' });

		delete user['password'];

		ServerResponse.json(res, {
			success: true,
			message: 'success',
			body: { info: user, token: token },
		});
	};

	static register = async (req, res, next) => {
		const username = req?.params?.username || '';
		const password = req?.body?.password;
		const securityCode = req?.body?.securityCode;

		const isValidRegisterKey = securityCode == registerKey;

		if (!isValidRegisterKey)
			return ServerResponse.json(res, {
				success: false,
				message: 'invalid code',
				body: { info: null },
			});

		if (!username || !password)
			return ServerResponse.json(res, {
				success: false,
				message: 'invalid parameters',
				body: { info: null },
			});

		const records = User.functions.readAllRecords() || {};

		const findedRecord = records[username] || null;

		if (findedRecord)
			return ServerResponse.json(res, {
				success: false,
				message: 'user is registered',
				body: { info: null },
			});

		const hashedPassword = bcrypt.hashSync(password, 10);

		const record = {
			id: Date.now(),
			username: username,
			password: hashedPassword,
			lastName: null,
			firstName: null,
		};

		const { data, err } = FS.writeFileSync(
			__filename_db_user,
			JSON.stringify({ ...records, [username]: record }, null, 2)
		);

		if (err)
			return ServerResponse.json(res, {
				success: false,
				message: 'can not register',
				body: { info: null },
			});

		const token = jwt.sign({ username: username }, tokenKey, { expiresIn: '24h' });

		delete record['password'];
		ServerResponse.json(res, {
			success: true,
			message: 'success',
			body: { info: record, token: token },
		});
	};

	static resetPassword = async (req, res, next) => {
		const username = req?.user?.username;

		if (!username)
			return ServerResponse.json(res, {
				success: false,
				statusCode: 401,
				message: 'user not found',
				body: { info: null },
			});

		const password = req?.body?.password;
		const newPassword = req?.body?.newPassword;

		if (!password || !newPassword)
			return ServerResponse.json(res, {
				success: false,
				message: 'invalid parameters',
				body: { info: null },
			});

		const records = User.functions.readAllRecords() || {};

		const findedRecord = records[username] || null;

		if (!findedRecord)
			return ServerResponse.json(res, {
				success: false,
				message: 'user is not registered',
				body: { info: null },
			});

		const isValidPassword = bcrypt.compareSync(password, findedRecord.password);

		if (!isValidPassword)
			return ServerResponse.json(res, {
				success: false,
				message: 'password not correct',
				body: { info: null },
			});

		const hashedPassword = bcrypt.hashSync(newPassword, 10);

		const record = {
			...findedRecord,
			password: hashedPassword,
		};

		const { data, err } = FS.writeFileSync(
			__filename_db_user,
			JSON.stringify({ ...records, [username]: record }, null, 2)
		);

		if (err)
			return ServerResponse.json(res, {
				success: false,
				message: 'can not change password',
				body: { info: null },
			});

		delete record['password'];

		ServerResponse.json(res, {
			success: true,
			message: 'success',
			body: { info: record },
		});
	};
}
