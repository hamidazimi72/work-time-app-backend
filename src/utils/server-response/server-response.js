export class ServerResponse {
	static json = (res, data = { success, statusCode, message, error, body }) => {
		const success =
			'success' in data ? data?.success || false : data?.statusCode >= 200 && data?.statusCode < 300 ? true : false;
		const statusCode = data?.statusCode || (data?.success ? 200 : 400);
		const message = data?.message || null;
		const error = typeof data?.error === 'string' ? data?.error || null : data?.error?.errors?.[0]?.message || null;
		const body = data?.body || null;

		const moreData = Object.keys(data || {}).reduce((result, currentKey) => {
			if (['success', 'statusCode', 'message', 'body'].includes(currentKey)) return result;
			else return { ...result, [currentKey]: data[currentKey] };
		}, {});

		res.status(statusCode).json({
			success,
			statusCode,
			message,
			error,
			body,
			...moreData,
		});
	};

	static checkValidation = (res, options = { access, validParams, message }) => {
		const access = options?.access || false;
		const validParams = options?.validParams || false;
		const message = options?.message || null;

		if (!access) {
			ServerResponse.json(res, {
				statusCode: 403,
				message: message || 'Not Access',
			});

			return false;
		}

		if (!validParams) {
			ServerResponse.json(res, {
				success: false,
				message: 'Parameters Invalid',
			});

			return false;
		}

		return true;
	};
}
