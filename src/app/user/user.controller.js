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
}
