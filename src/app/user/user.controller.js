import { ServerResponse, FS } from '../../utils/index.js';

import { __filename_db_user } from '../../db/config.js';

export class User {
	static login = async (req, res, next) => {
		const username = req?.params?.username || '';
		const password = req?.body?.password;

		FS.readFilePromise(__filename_db_user).then(({ data, err }) => {
			const records = data ? JSON.parse(data) : {};
			const record = records?.[username] || null;

			if (!record)
				return ServerResponse.json(res, {
					success: false,
					message: 'user not found',
					body: { info: null },
				});

			if (record?.password != password)
				return ServerResponse.json(res, {
					success: false,
					message: 'wrong password',
					body: { info: null },
				});

			delete record['password'];
			ServerResponse.json(res, {
				success: true,
				message: 'success',
				body: { info: record },
			});
		});
	};

	static register = async (req, res, next) => {
		const username = req?.params?.username || '';
		const password = req?.body?.password;
		const securityCode = req?.body?.securityCode;

		if (securityCode !== 118303)
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

		const records = JSON.parse(FS.readFileSync(__filename_db_user)?.data || '{}');

		const findedRecord = records?.[username] || null;

		if (findedRecord)
			return ServerResponse.json(res, {
				success: false,
				message: 'user is registered',
				body: { info: null },
			});

		const record = {
			id: Date.now(),
			username: username ?? null,
			password: password ?? null,
			lastName: null,
			firstName: null,
		};

		const { data, err } = FS.writeFileSync(__filename_db_user, JSON.stringify({ ...records, [username]: record }));

		if (err)
			return ServerResponse.json(res, {
				success: false,
				message: 'can not register',
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
