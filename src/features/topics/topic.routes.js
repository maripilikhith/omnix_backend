import { Router } from 'express';
import { topicController } from './topic.controller.js';

const router = Router();

router.get('/', topicController.listAll);
router.post('/', topicController.create);
router.put('/:id', topicController.update);
router.delete('/:id', topicController.remove);

export { router as topicRoutes };
