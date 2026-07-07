import { storyService } from './story.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const storyController = {
  listAll: catchAsync(async (_req, res) => {
    const stories = await storyService.getAllStoriesAdmin();
    return ApiResponse.success(res, stories);
  }),
  create: catchAsync(async (req, res) => {
    const story = await storyService.createStory(req.body);
    return ApiResponse.created(res, story);
  }),
  update: catchAsync(async (req, res) => {
    const story = await storyService.updateStory(req.params.id, req.body);
    return ApiResponse.success(res, story);
  }),
  remove: catchAsync(async (req, res) => {
    await storyService.deleteStory(req.params.id);
    return ApiResponse.success(res, { message: 'Story deleted successfully' });
  }),

  // Legacy
  legacyListAll: catchAsync(async (_req, res) => {
    const stories = await storyService.getAllStoriesAdmin();
    return ApiResponse.raw(res, stories);
  }),
  legacyCreate: catchAsync(async (req, res) => {
    const story = await storyService.createStory(req.body);
    return ApiResponse.raw(res, story, 201);
  }),
  legacyUpdate: catchAsync(async (req, res) => {
    const story = await storyService.updateStory(req.params.id, req.body);
    return ApiResponse.raw(res, story);
  }),
  legacyRemove: catchAsync(async (req, res) => {
    await storyService.deleteStory(req.params.id);
    return ApiResponse.raw(res, { message: 'Story deleted successfully' });
  }),
};
