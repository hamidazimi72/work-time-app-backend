import express from 'express';

import { Example as ExampleController } from '../../controllers/index.js';

const router = express.Router();

router.post('/save', ExampleController.save);
router.post('/fetch', ExampleController.fetchAll);
router.post('/fetch/id', ExampleController.fetchId);
router.post('/update', ExampleController.update);
router.post('/delete', ExampleController.destroy);

export { router };
export default router;
