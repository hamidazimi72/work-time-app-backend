import express from 'express';

import { authenticateToken } from '../../middlewares/index.js';

import { Task } from './task.controller.js';

const router = express.Router();

router.get('/v1/task', authenticateToken, Task.search);
router.post('/v1/task', authenticateToken, Task.save);
router.put('/v1/task', authenticateToken, Task.edit);
router.delete('/v1/task/:id', authenticateToken, Task.delete);

export default router;
