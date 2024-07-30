import express from 'express';

import { authenticateToken } from '../../middlewares/index.js';

import { Worktime } from './worktime.controller.js';

const router = express.Router();

router.get('/v1/worktimes', authenticateToken, Worktime.search);
router.post('/v1/worktimes', authenticateToken, Worktime.save);
router.put('/v1/worktimes', authenticateToken, Worktime.edit);
router.delete('/v1/worktimes/:id', authenticateToken, Worktime.delete);

export default router;
