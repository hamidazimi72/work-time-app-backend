import express from 'express';

import { authenticateToken } from '../../middlewares/index.js';

import { Worktimes_Controller } from './worktimes.controller.js';

const router = express.Router();

router.get('/v1/worktimes', authenticateToken, Worktimes_Controller.search);
router.get('/v1/worktimes/:id', authenticateToken, Worktimes_Controller.get);
router.post('/v1/worktimes', authenticateToken, Worktimes_Controller.save);
router.put('/v1/worktimes/:id', authenticateToken, Worktimes_Controller.update);
router.delete('/v1/worktimes/:id', authenticateToken, Worktimes_Controller.delete);

export const Worktimes_Route = router;
