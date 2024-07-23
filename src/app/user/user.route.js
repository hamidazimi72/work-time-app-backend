import express from 'express';

import { User } from './user.controller.js';

const router = express.Router();

router.post('/v1/users/:username/login', User.login);

export default router;
