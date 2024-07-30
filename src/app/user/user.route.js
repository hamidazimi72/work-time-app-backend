import express from 'express';

import { User } from './user.controller.js';

const router = express.Router();

router.post('/v1/users/:username/login', User.login);
router.post('/v1/users/:username/register', User.register);
router.post('/v1/users/:username/reset-password', User.resetPassword);

export default router;
