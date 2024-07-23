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
			const records = (data ? JSON.parse(data) : []).filter((item) => item.user == token);

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
			req?.body?.arrivalTime,
			req?.body?.departureTime,
			req?.body?.isVacation,
		];

		if (!arrivalTime || isVacation === undefined)
			return ServerResponse.json(res, {
				success: false,
				message: 'parameters not valid',
				body: { info: null },
			});

		const records = JSON.parse(FS.readFileSync(__dirname_db).data || '[]');

		const record = {
			id: Date.now(),
			user: token,
			arrivalTime: arrivalTime ?? null,
			departureTime: departureTime ?? null,
			isVacation: isVacation ?? null,
		};

		const { data, err } = FS.writeFileSync(__dirname_db, JSON.stringify([...records, record]));

		if (err)
			return ServerResponse.json(res, {
				success: false,
				message: 'can not save',
				body: { info: null },
			});

		return ServerResponse.json(res, {
			success: true,
			message: 'success',
			body: { info: record },
		});
	};

	static edit = async (req, res, next) => {
		return ServerResponse.json(res, { success: true, message: 'success', body: null });
	};

	static delete = async (req, res, next) => {
		return ServerResponse.json(res, { success: true, message: 'success', body: null });
	};
}
