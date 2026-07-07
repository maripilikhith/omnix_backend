import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const analyticsController = {
  trackEvent: catchAsync(async (_req, res) => ApiResponse.success(res, { message: 'Event tracked — coming soon' })),
  getDashboard: catchAsync(async (_req, res) => ApiResponse.success(res, { message: 'Analytics dashboard — coming soon' })),
};
