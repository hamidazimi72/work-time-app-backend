import express from 'express';

import { Cost } from './cost.controller.js';

const router = express.Router();

router.get('/v1/costs', Cost.search);
router.post('/v1/costs', Cost.save);
router.put('/v1/costs', Cost.edit);
router.delete('/v1/costs/:id', Cost.delete);

export default router;
