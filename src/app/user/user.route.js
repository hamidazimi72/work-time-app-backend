import express from 'express';

import { User } from './user.controller.js';
import { authenticateToken } from '../../middlewares/index.js';

const router = express.Router();

router.post('/v1/users/:username/login', User.login);
router.post('/v1/users/:username/register', User.register);
router.post('/v1/users/:username/reset-password', authenticateToken, User.resetPassword);

export default router;
