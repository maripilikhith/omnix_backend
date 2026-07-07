import { topicService } from './topic.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const topicController = {
  listAll: catchAsync(async (_req, res) => {
    const topics = await topicService.getAllTopicsAdmin();
    return ApiResponse.success(res, topics);
  }),
  create: catchAsync(async (req, res) => {
    const topic = await topicService.createTopic(req.body);
    return ApiResponse.created(res, topic);
  }),
  update: catchAsync(async (req, res) => {
    const topic = await topicService.updateTopic(req.params.id, req.body);
    return ApiResponse.success(res, topic);
  }),
  remove: catchAsync(async (req, res) => {
    await topicService.deleteTopic(req.params.id);
    return ApiResponse.success(res, { message: 'Topic deleted successfully' });
  }),

  // Legacy
  legacyListAll: catchAsync(async (_req, res) => {
    const topics = await topicService.getAllTopicsAdmin();
    return ApiResponse.raw(res, topics);
  }),
  legacyCreate: catchAsync(async (req, res) => {
    const topic = await topicService.createTopic(req.body);
    return ApiResponse.raw(res, topic, 201);
  }),
  legacyUpdate: catchAsync(async (req, res) => {
    const topic = await topicService.updateTopic(req.params.id, req.body);
    return ApiResponse.raw(res, topic);
  }),
  legacyRemove: catchAsync(async (req, res) => {
    await topicService.deleteTopic(req.params.id);
    return ApiResponse.raw(res, { message: 'Topic deleted successfully' });
  }),
};
