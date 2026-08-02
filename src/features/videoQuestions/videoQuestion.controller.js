import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { videoQuestionService } from './videoQuestion.service.js';

export const videoQuestionController = {
  listByStory: catchAsync(async (req, res) => {
    const { storyId } = req.params;
    const questions = await videoQuestionService.listByStory(storyId);
    return ApiResponse.success(res, { questions });
  }),

  create: catchAsync(async (req, res) => {
    const question = await videoQuestionService.create(req.body);
    return ApiResponse.created(res, { question });
  }),

  setupQuestion: catchAsync(async (req, res) => {
    const result = await videoQuestionService.setupQuestion(req.body);
    return res.json(result);
  }),

  evaluateAnswer: catchAsync(async (req, res) => {
    const result = await videoQuestionService.evaluateAnswer(req.body);
    return res.json(result);
  }),
};
