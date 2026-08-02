import { catchAsync } from '../../utils/catchAsync.js';
import { aiChatService } from '../aiChat/aiChat.service.js';
import { videoQuestionService } from '../videoQuestions/videoQuestion.service.js';

export const aiController = {
  queryResolver: catchAsync(async (req, res) => {
    const result = await aiChatService.resolveQuery(req.body);
    return res.json(result);
  }),

  evaluateAnswer: catchAsync(async (req, res) => {
    const result = await videoQuestionService.evaluateAnswer(req.body);
    return res.json(result);
  }),
};
