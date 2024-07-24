import path from 'path';
import url from 'url';

import { ServerResponse, FS } from '../../utils/index.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const __dirname_db = path.resolve(__dirname, 'db.json');

export class Worktime {
	static search = async (req, res, next) => {
		//
		const token = req?.headers?.token || '';

		const [arrivalTimeFrom, arrivalTimeTo, arrivalSort] = [
			req?.query?.arrivalTimeFrom,
			req?.query?.arrivalTimeTo,
			req?.query?.arrivalSort,
		];

		if (!token)
			return ServerResponse.json(res, {
				success: false,
				statusCode: 401,
				message: 'user not found',
				body: { info: [] },
			});

		FS.readFilePromise(__dirname_db).then(({ data, err }) => {
			const records = (data ? JSON.parse(data) : []).filter((item) => {
				if (item.user != token) return false;
				if (arrivalTimeFrom && item.arrivalTime < arrivalTimeFrom) return false;
				if (arrivalTimeTo && item.arrivalTime > arrivalTimeTo) return false;
				return true;
			});

			if (arrivalSort)
				records.sort((a, b) =>
					arrivalSort === 'asc' ? a.arrivalTime || 0 - b.arrivalTime || 0 : b.arrivalTime || 0 - a.arrivalTime || 0
				);

			if (err)
				return ServerResponse.json(res, {
					success: false,
					message: 'internal error',
					body: { info: [] },
				});

			return ServerResponse.json(res, {
				success: true,
				message: 'success',
				body: { info: records },
			});
		});
	};

	static save = async (req, res, next) => {
		//
		const token = req?.headers?.token || '';

		if (!token)
			return ServerResponse.json(res, {
				success: false,
				statusCode: 401,
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
		//
		const token = req?.headers?.token || '';

		if (!token)
			return ServerResponse.json(res, {
				success: false,
				statusCode: 401,
				message: 'user not found',
				body: { info: null },
			});

		const [id, arrivalTime, departureTime, isVacation] = [
			req?.body?.id,
			req?.body?.arrivalTime,
			req?.body?.departureTime,
			req?.body?.isVacation,
		];

		if (!id || !arrivalTime || isVacation === undefined)
			return ServerResponse.json(res, {
				success: false,
				message: 'parameters not valid',
				body: { info: null },
			});

		const records = JSON.parse(FS.readFileSync(__dirname_db).data || '[]');
		const recordIndex = records.findIndex((item) => item.id == id && item.user == token);

		if (recordIndex < 0)
			return ServerResponse.json(res, {
				success: false,
				message: 'item not found',
				body: { info: null },
			});

		records[recordIndex] = {
			...records[recordIndex],
			arrivalTime: arrivalTime ?? null,
			departureTime: departureTime ?? null,
			isVacation: isVacation ?? null,
		};

		const { data, err } = FS.writeFileSync(__dirname_db, JSON.stringify(records));

		if (err)
			return ServerResponse.json(res, {
				success: false,
				message: 'can not edit',
				body: { info: null },
			});

		return ServerResponse.json(res, {
			success: true,
			message: 'success',
			body: { info: records?.[recordIndex] || null },
		});
	};

	static delete = async (req, res, next) => {
		//
		const token = req?.headers?.token || '';
		const id = req?.params?.id || '';

		if (!token)
			return ServerResponse.json(res, {
				success: false,
				statusCode: 401,
				message: 'user not found',
				body: { info: null },
			});

		if (!id)
			return ServerResponse.json(res, {
				success: false,
				message: 'id not valid',
				body: { info: null },
			});

		const records = JSON.parse(FS.readFileSync(__dirname_db).data || '[]');

		const recordIndex = records.findIndex((item) => item.id == id && item.user == token);

		if (recordIndex < 0)
			return ServerResponse.json(res, {
				success: false,
				message: 'item not found',
				body: { info: null },
			});

		const { data, err } = FS.writeFileSync(
			__dirname_db,
			JSON.stringify(records.filter((item, i) => i !== recordIndex))
		);

		if (err)
			return ServerResponse.json(res, {
				success: false,
				message: 'can not delete',
				body: { info: null },
			});

		return ServerResponse.json(res, {
			success: true,
			message: 'success',
			body: { info: records?.[recordIndex] || null },
		});
	};
}
