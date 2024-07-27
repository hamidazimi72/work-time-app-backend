import { Router } from 'express';

//____________________* Entities Routes*____________________//
import user from './user/user.route.js';
import worktime from './worktime/worktime.route.js';
import cost from './cost/cost.route.js';
import task from './task/task.route.js';

const apiRoutes = Router().use(user, worktime, cost, task);

const routes = Router().use('/api', apiRoutes);

export { routes };
export default routes;
