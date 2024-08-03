console.clear();
//____________________* Internal Imports*____________________//
import path from 'path';
import url from 'url';

//____________________* External Imports*____________________//
import express from 'express';
import chalk from 'chalk';
import 'dotenv/config';

//____________________* Module Imports *____________________//
import {} from './utils/index.js';
import { allowCross, logger } from './middlewares/index.js';
import { routes } from './routes/routes.js';
import { sequelize } from './config/database.js';
import { Users_Seeder } from './app/index.js';

//____________________*  Vars *____________________//
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

//____________________* Create Server *____________________//
const app = express();

//____________________* use Middlewares *____________________//
app.use(allowCross);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(logger);
app.use(routes);

//____________________* DataBase Connect & Listen Port *____________________//
sequelize
	.sync()
	.then(async () => {
		await Users_Seeder.insertAdmin();

		app.listen(process.env.PORT, () => {
			const modeName = chalk.bgGreenBright(` ${process.env.NODE_ENV} `);
			const hostName = chalk.bgBlueBright(` http://localhost:${process.env.PORT} `);

			console.log(`server is running in ${modeName} mode - open: ${hostName}`);
		});
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});
