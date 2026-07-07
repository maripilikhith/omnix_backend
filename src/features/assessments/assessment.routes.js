import { Router } from 'express';
import { assessmentController } from './assessment.controller.js';

const router = Router();
router.get('/topic/:topicId', assessmentController.getByTopic);
router.post('/submit', assessmentController.submit);
router.post('/', assessmentController.create);

export { router as assessmentRoutes };
