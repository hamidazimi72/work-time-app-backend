import express from 'express';

import { authenticateAdminToken, authenticateToken } from '../../middlewares/index.js';

import { Users_Controller } from './users.controller.js';

const router = express.Router();

router.get('/v1/users', authenticateAdminToken, Users_Controller.search);
router.get('/v1/users/:id', authenticateToken, Users_Controller.get);
router.post('/v1/users', Users_Controller.save);
router.put('/v1/users/:id', authenticateToken, Users_Controller.update);
router.delete('/v1/users/:id', authenticateToken, Users_Controller.delete);

router.post('/v1/users/login', Users_Controller.login);

export const Users_Route = router;
