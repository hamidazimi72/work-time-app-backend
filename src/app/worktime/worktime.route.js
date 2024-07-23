import express from 'express';

import { Worktime } from './worktime.controller.js';

const router = express.Router();

router.get('/v1/worktimes', Worktime.search);
router.post('/v1/worktimes', Worktime.save);
router.put('/v1/worktimes', Worktime.edit);
router.delete('/v1/worktimes', Worktime.delete);

export default router;
