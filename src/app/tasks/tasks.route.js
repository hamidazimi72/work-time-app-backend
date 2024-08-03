import express from 'express';

import { authenticateToken } from '../../middlewares/index.js';

import { Tasks_Controller } from './tasks.controller.js';

const router = express.Router();

router.get('/v1/tasks', authenticateToken, Tasks_Controller.search);
router.get('/v1/tasks/:id', authenticateToken, Tasks_Controller.get);
router.post('/v1/tasks', authenticateToken, Tasks_Controller.save);
router.put('/v1/tasks/:id', authenticateToken, Tasks_Controller.update);
router.delete('/v1/tasks/:id', authenticateToken, Tasks_Controller.delete);

export const Tasks_Route = router;
