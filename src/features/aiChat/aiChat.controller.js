import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { aiChatService } from './aiChat.service.js';

export const aiChatController = {
  sendMessage: catchAsync(async (req, res) => {
    const { message, context } = req.body;
    const reply = await aiChatService.chat(message, context);
    return ApiResponse.success(res, { reply });
  }),

  getHistory: catchAsync(async (_req, res) => {
    return ApiResponse.success(res, { messages: [] });
  }),

  resolveQuery: catchAsync(async (req, res) => {
    const result = await aiChatService.resolveQuery(req.body);
    return res.json(result);
  }),
};
