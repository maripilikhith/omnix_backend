import { Router } from 'express';
import { aiController } from './ai.controller.js';

const router = Router();

router.post('/query-resolver', aiController.queryResolver);
router.post('/qna', aiController.evaluateAnswer);

export { router as aiRoutes };
