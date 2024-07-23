import path from 'path';
import url from 'url';

import { ServerResponse, FS } from '../../utils/index.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const __dirname_db = path.resolve(__dirname, 'db.json');

export class Worktime {
	static search = async (req, res, next) => {
		//
		const token = req?.headers?.token || '';

		if (!token)
			return ServerResponse.json(res, {
				success: false,
				message: 'user not found',
				body: { info: [] },
			});

		FS.readFilePromise(__dirname_db).then(({ data, err }) => {
			const records = data ? JSON.parse(data) : [];

			if (err)
				return ServerResponse.json(res, {
					success: false,
					message: 'internal error',
					body: { info: [] },
				});

			return ServerResponse.json(res, {
				success: true,
				message: 'success',
				body: { info: records, token },
			});
		});
	};

	static save = async (req, res, next) => {
		//
		const token = req?.headers?.token || '';

		if (!token)
			return ServerResponse.json(res, {
				success: false,
				message: 'user not found',
				body: { info: null },
			});

		const [arrivalTime, departureTime, isVacation] = [
			req?.query?.arrivalTime,
			req?.query?.departureTime,
			req?.query?.isVacation,
		];

		if (!arrivalTime || isVacation === undefined)
			return ServerResponse.json(res, {
				success: false,
				message: 'parameters not valid',
				body: { info: null },
			});

		// FS.readFilePromise(__dirname_db).then(({ data, err }) => {
		// 	const records = data ? JSON.parse(data) : [];

		// 	if (err)
		// 		return ServerResponse.json(res, {
		// 			success: false,
		// 			message: 'internal error',
		// 			body: { info: [] },
		// 		});

		// 	return ServerResponse.json(res, {
		// 		success: true,
		// 		message: 'success',
		// 		body: { info: records, token },
		// 	});
		// });

		return ServerResponse.json(res, { success: true, message: 'success', body: { id: -1 } });
	};

	static edit = async (req, res, next) => {
		return ServerResponse.json(res, { success: true, message: 'success', body: null });
	};

	static delete = async (req, res, next) => {
		return ServerResponse.json(res, { success: true, message: 'success', body: null });
	};
}
