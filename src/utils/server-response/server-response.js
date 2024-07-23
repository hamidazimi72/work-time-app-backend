export class ServerResponse {
	static json = (res, data = { success, statusCode, message, body }) => {
		const success =
			'success' in data ? data?.success || false : data?.statusCode >= 200 && data?.statusCode < 300 ? true : false;
		const statusCode = data?.statusCode || (data?.success ? 200 : 400);
		const message = data?.message || null;
		const body = data?.body || null;

		const moreData = Object.keys(data || {}).reduce((result, currentKey) => {
			if (['success', 'statusCode', 'message', 'body'].includes(currentKey)) return result;
			else return { ...result, [currentKey]: data[currentKey] };
		}, {});

		res.status(statusCode).json({
			success,
			statusCode,
			message,
			body,
			...moreData,
		});
	};
}
