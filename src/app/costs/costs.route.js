import express from 'express';

import { authenticateToken } from '../../middlewares/index.js';

import { Costs_Controller } from './costs.controller.js';

const router = express.Router();

router.get('/v1/costs', authenticateToken, Costs_Controller.search);
router.get('/v1/costs/:id', authenticateToken, Costs_Controller.get);
router.post('/v1/costs', authenticateToken, Costs_Controller.save);
router.put('/v1/costs/:id', authenticateToken, Costs_Controller.update);
router.delete('/v1/costs/:id', authenticateToken, Costs_Controller.delete);

export const Costs_Route = router;
