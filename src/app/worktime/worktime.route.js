import express from 'express';

import { User } from './user.controller.js';

const router = express.Router();

router.get('/v1/users', User.search);
router.get('/v1/users/:id', User.get);
router.post('/v1/users', User.save);
router.put('/v1/users', User.edit);
router.delete('/v1/users', User.delete);

export default router;
