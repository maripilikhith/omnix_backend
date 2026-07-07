import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

/**
 * Admin dashboard controller.
 * Aggregates statistics across the platform.
 */
export const adminController = {
  getDashboardStats: catchAsync(async (_req, res) => {
    // TODO: Aggregate counts from all models
    return ApiResponse.success(res, {
      message: 'Admin dashboard stats — coming soon',
      stats: {
        totalCourses: 0,
        totalModules: 0,
        totalTopics: 0,
        totalStories: 0,
        totalExplainers: 0,
        totalUsers: 0,
      },
    });
  }),
};
