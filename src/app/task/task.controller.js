import { ServerResponse, FS } from '../../utils/index.js';

import { __filename_db_cost } from '../../db/config.js';

export class Task {
	static search = async (req, res, next) => {
		//
		const token = req?.headers?.token || '';

		const [dateFrom, dateTo, dateSort] = [req?.query?.dateFrom, req?.query?.dateTo, req?.query?.dateSort];

		if (!token)
			return ServerResponse.json(res, {
				success: false,
				statusCode: 401,
				message: 'user not found',
				body: { info: [] },
			});

		FS.readFilePromise(__filename_db_cost).then(({ data, err }) => {
			const records = (data ? JSON.parse(data) : []).filter((item) => {
				if (item.user != token) return false;
				if (dateFrom && item.date < dateFrom) return false;
				if (dateTo && item.date > dateTo) return false;
				return true;
			});

			if (dateSort)
				records.sort((a, b) => (dateSort === 'asc' ? (a.date || 0) - (b.date || 0) : (b.date || 0) - (a.date || 0)));

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

		const [date, price, category, description] = [
			req?.body?.date,
			req?.body?.price,
			req?.body?.category,
			req?.body?.description,
		];

		if (!date || !category || isNaN(price))
			return ServerResponse.json(res, {
				success: false,
				message: 'parameters not valid',
				body: { info: null },
			});

		const records = JSON.parse(FS.readFileSync(__filename_db_cost).data || '[]');

		const record = {
			id: Date.now(),
			user: token,
			date: date ?? null,
			price: price ?? null,
			category: category ?? null,
			description: description ?? null,
		};

		const { data, err } = FS.writeFileSync(__filename_db_cost, JSON.stringify([...records, record]));

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

		const [id, date, price, category, description] = [
			req?.body?.id,
			req?.body?.date,
			req?.body?.price,
			req?.body?.category,
			req?.body?.description,
		];

		if (!id || !date)
			return ServerResponse.json(res, {
				success: false,
				message: 'parameters not valid',
				body: { info: null },
			});

		const records = JSON.parse(FS.readFileSync(__filename_db_cost).data || '[]');
		const recordIndex = records.findIndex((item) => item.id == id && item.user == token);

		if (recordIndex < 0)
			return ServerResponse.json(res, {
				success: false,
				message: 'item not found',
				body: { info: null },
			});

		records[recordIndex] = {
			...records[recordIndex],
			date: date ?? null,
			price: price ?? null,
			category: category ?? null,
			description: description ?? null,
		};

		const { data, err } = FS.writeFileSync(__filename_db_cost, JSON.stringify(records));

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

		const records = JSON.parse(FS.readFileSync(__filename_db_cost).data || '[]');

		const recordIndex = records.findIndex((item) => item.id == id && item.user == token);

		if (recordIndex < 0)
			return ServerResponse.json(res, {
				success: false,
				message: 'item not found',
				body: { info: null },
			});

		const { data, err } = FS.writeFileSync(
			__filename_db_cost,
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
