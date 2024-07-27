import express from 'express';

import { Task } from './task.controller.js';

const router = express.Router();

router.get('/v1/task', Task.search);
router.post('/v1/task', Task.save);
router.put('/v1/task', Task.edit);
router.delete('/v1/task/:id', Task.delete);

export default router;
