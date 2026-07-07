import { Router } from 'express';
import { explainerController } from './explainer.controller.js';

const router = Router();
router.get('/', explainerController.listAll);
router.post('/', explainerController.create);
router.put('/:id', explainerController.update);
router.delete('/:id', explainerController.remove);

export { router as explainerRoutes };
