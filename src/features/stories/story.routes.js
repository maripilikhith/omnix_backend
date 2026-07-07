import { Router } from 'express';
import { storyController } from './story.controller.js';

const router = Router();
router.get('/', storyController.listAll);
router.post('/', storyController.create);
router.put('/:id', storyController.update);
router.delete('/:id', storyController.remove);

export { router as storyRoutes };
