import { Router } from 'express';
import { videoQuestionController } from './videoQuestion.controller.js';

const router = Router();
router.get('/story/:storyId', videoQuestionController.listByStory);
router.post('/', videoQuestionController.create);

export { router as videoQuestionRoutes };
