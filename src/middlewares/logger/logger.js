import chalk from 'chalk';

export const logger = (req, res, next) => {
	if (typeof next !== 'function') return;

	const startTime = Date.now();
	next();

	const duration = chalk.bgBlueBright(` ${Date.now() - startTime} ms `);
	const url = chalk.bgGreen(` ${req?.originalUrl || ''} `);
	const method = chalk.bgYellow(` ${req?.method || ''} `);
	const statusCode = chalk.bgBlackBright(` Status: ${res?.statusCode ?? "-"} `)


	const content = `-----------------------------------------------------
REQ: ${url} ${method} ${duration} => RES: ${statusCode}`;

	console.log(content);
};
