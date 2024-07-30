export const allowCross = (req, res, next) => {
	if (typeof res?.setHeader !== 'function' || typeof next !== 'function') return;

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
	res.setHeader('Access-Control-Allow-headers', '*');

	next();
};
