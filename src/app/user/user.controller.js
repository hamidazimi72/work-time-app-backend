import path from 'path';
import url from 'url';

import { ServerResponse, FS } from '../../utils/index.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const __dirname_db = path.resolve(__dirname, 'db.json');

export class User {
	static login = async (req, res, next) => {
		const username = req?.params?.username || '';

		FS.readFilePromise(__dirname_db).then(({ data, err }) => {
			const records = data ? JSON.parse(data) : {};
			const record = records?.[username] || null;

			if (record) delete record['password'];

			if (record)
				ServerResponse.json(res, {
					success: true,
					message: 'success',
					body: { info: record },
				});
			else
				ServerResponse.json(res, {
					success: false,
					message: 'user not found',
					body: { info: null },
				});
		});
	};
}
