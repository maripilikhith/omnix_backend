import { Router } from 'express';
import { moduleController } from './module.controller.js';

const router = Router();

router.get('/', moduleController.listAll);
router.post('/', moduleController.create);
router.put('/:id', moduleController.update);
router.delete('/:id', moduleController.remove);

export { router as moduleRoutes };
