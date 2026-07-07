import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const aiChatController = {
  sendMessage: catchAsync(async (_req, res) => {
    return ApiResponse.success(res, { message: 'AI Chat — coming soon' });
  }),
  getHistory: catchAsync(async (_req, res) => {
    return ApiResponse.success(res, { messages: [] });
  }),
};
