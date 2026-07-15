import { Router } from 'express';
import { healthController } from './health.controller.js';

const router = Router();

router.get('/health', healthController.check);
router.get('/health/live', healthController.live);
router.get('/health/ready', healthController.ready);
router.get('/ping', healthController.ping);

export { router as healthRoutes };

