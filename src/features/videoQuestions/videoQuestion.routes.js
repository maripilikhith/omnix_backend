import { Router } from 'express';
import { videoQuestionController } from './videoQuestion.controller.js';

const router = Router();
router.get('/story/:storyId', videoQuestionController.listByStory);
router.post('/', videoQuestionController.create);

// Interactive Video tested routes (converted to Node)
router.post('/setup-question', videoQuestionController.setupQuestion);
router.post('/setup', videoQuestionController.setupQuestion);
router.post('/evaluate', videoQuestionController.evaluateAnswer);
router.post('/qna', videoQuestionController.evaluateAnswer);

export { router as videoQuestionRoutes };
