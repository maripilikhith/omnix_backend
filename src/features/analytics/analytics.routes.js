import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';

const router = Router();
router.post('/event', analyticsController.trackEvent);
router.get('/dashboard', analyticsController.getDashboard);

export { router as analyticsRoutes };
