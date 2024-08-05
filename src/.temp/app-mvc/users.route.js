import express from 'express';

import { Users } from './users.controller.js';

const router = express.Router();

router.get('/v1/users', Users.search);
router.get('/v1/users/:id', Users.get);
router.post('/v1/users', Users.save);
router.put('/v1/users', Users.edit);
router.delete('/v1/users', Users.delete);

export default router;
