import { ServerResponse, FS } from '../../utils/index.js';

import { __filename_db_task } from '../../db/config.js';

export class Task {
	static search = async (req, res, next) => {
		//
		const token = req?.headers?.token || '';

		const [isComplete] = [req?.query?.isComplete];

		if (!token)
			return ServerResponse.json(res, {
				success: false,
				statusCode: 401,
				message: 'user not found',
				body: { info: [] },
			});

		FS.readFilePromise(__filename_db_task).then(({ data, err }) => {
			const records = (data ? JSON.parse(data) : []).filter((item) => {
				if (item.user != token) return false;
				if (isComplete === undefined) return true;
				if (String(item.isComplete) !== isComplete) return false;
				return true;
			});

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

		const [isComplete, title] = [req?.body?.isComplete, req?.body?.title];

		if (isComplete === undefined || !title)
			return ServerResponse.json(res, {
				success: false,
				message: 'parameters not valid',
				body: { info: null },
			});

		const records = JSON.parse(FS.readFileSync(__filename_db_task).data || '[]');

		const record = {
			id: Date.now(),
			user: token,
			isComplete: isComplete ?? null,
			title: title ?? null,
		};

		const { data, err } = FS.writeFileSync(__filename_db_task, JSON.stringify([...records, record]));

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

		const [id, isComplete, title] = [req?.body?.id, req?.body?.isComplete, req?.body?.title];

		if (!id || !title || isComplete === undefined)
			return ServerResponse.json(res, {
				success: false,
				message: 'parameters not valid',
				body: { info: null },
			});

		const records = JSON.parse(FS.readFileSync(__filename_db_task).data || '[]');
		const recordIndex = records.findIndex((item) => item.id == id && item.user == token);

		if (recordIndex < 0)
			return ServerResponse.json(res, {
				success: false,
				message: 'item not found',
				body: { info: null },
			});

		records[recordIndex] = {
			...records[recordIndex],
			isComplete: isComplete ?? null,
			title: title ?? null,
		};

		const { data, err } = FS.writeFileSync(__filename_db_task, JSON.stringify(records));

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

		const records = JSON.parse(FS.readFileSync(__filename_db_task).data || '[]');

		const recordIndex = records.findIndex((item) => item.id == id && item.user == token);

		if (recordIndex < 0)
			return ServerResponse.json(res, {
				success: false,
				message: 'item not found',
				body: { info: null },
			});

		const { data, err } = FS.writeFileSync(
			__filename_db_task,
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
