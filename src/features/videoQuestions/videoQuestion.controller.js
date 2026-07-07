import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const videoQuestionController = {
  listByStory: catchAsync(async (_req, res) => {
    return ApiResponse.success(res, { message: 'Video questions — coming soon' });
  }),
  create: catchAsync(async (req, res) => {
    return ApiResponse.success(res, { message: 'Create video question — coming soon' });
  }),
};
