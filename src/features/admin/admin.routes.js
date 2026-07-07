import { Router } from 'express';
import { adminController } from './admin.controller.js';

const router = Router();
router.get('/stats', adminController.getDashboardStats);

export { router as adminRoutes };
