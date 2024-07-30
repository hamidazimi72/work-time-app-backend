import express from 'express';

import { authenticateToken } from '../../middlewares/index.js';

import { Cost } from './cost.controller.js';

const router = express.Router();

router.get('/v1/costs', authenticateToken, Cost.search);
router.post('/v1/costs', authenticateToken, Cost.save);
router.put('/v1/costs', authenticateToken, Cost.edit);
router.delete('/v1/costs/:id', authenticateToken, Cost.delete);

export default router;
