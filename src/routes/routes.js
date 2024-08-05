import { Router } from 'express';

//____________________* Entities Routes*____________________//
import { Users_Route, Tasks_Route, Worktimes_Route, Costs_Route } from '../app/index.js';

const apiRoutes = Router().use(Users_Route, Tasks_Route, Worktimes_Route, Costs_Route);

const routes = Router().use('/api', apiRoutes);

export { routes };
export default routes;
