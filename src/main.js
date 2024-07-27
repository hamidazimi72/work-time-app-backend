console.clear();
//____________________* Internal Imports*____________________//
import path from 'path';
import url from 'url';

//____________________* External Imports*____________________//
import express from 'express';
import chalk from 'chalk';
import 'dotenv/config';

import cors from 'cors';

//____________________* Module Imports *____________________//
import {} from './utils/index.js';
import { allowCross, logger } from './middlewares/index.js';
import { routes } from './app/routes.js';

//____________________*  Vars *____________________//
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

//____________________* DataBase Connect *____________________//

//____________________* Create Server *____________________//
const app = express();

//____________________* use Middlewares *____________________//
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(logger);
app.use(routes);

//____________________* Listen Port *____________________//
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
	const modeName = chalk.bgGreenBright(` ${process.env.NODE_ENV || 'development'} `);
	const hostName = chalk.bgBlueBright(` http://localhost:${PORT} `);

	console.log(`server is running in ${modeName} mode - open: ${hostName}`);
});
