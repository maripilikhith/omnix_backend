import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const assessmentController = {
  getByTopic: catchAsync(async (_req, res) => ApiResponse.success(res, { message: 'Assessments — coming soon' })),
  submit: catchAsync(async (_req, res) => ApiResponse.success(res, { message: 'Submit assessment — coming soon' })),
  create: catchAsync(async (_req, res) => ApiResponse.success(res, { message: 'Create assessment — coming soon' })),
};
