import { explainerService } from './explainer.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const explainerController = {
  listAll: catchAsync(async (_req, res) => {
    const explainers = await explainerService.getAllExplainersAdmin();
    return ApiResponse.success(res, explainers);
  }),
  create: catchAsync(async (req, res) => {
    const explainer = await explainerService.createExplainer(req.body);
    return ApiResponse.created(res, explainer);
  }),
  update: catchAsync(async (req, res) => {
    const explainer = await explainerService.updateExplainer(req.params.id, req.body);
    return ApiResponse.success(res, explainer);
  }),
  remove: catchAsync(async (req, res) => {
    await explainerService.deleteExplainer(req.params.id);
    return ApiResponse.success(res, { message: 'Explainer deleted successfully' });
  }),

  // Legacy
  legacyListAll: catchAsync(async (_req, res) => {
    const explainers = await explainerService.getAllExplainersAdmin();
    return ApiResponse.raw(res, explainers);
  }),
  legacyCreate: catchAsync(async (req, res) => {
    const explainer = await explainerService.createExplainer(req.body);
    return ApiResponse.raw(res, explainer, 201);
  }),
  legacyUpdate: catchAsync(async (req, res) => {
    const explainer = await explainerService.updateExplainer(req.params.id, req.body);
    return ApiResponse.raw(res, explainer);
  }),
  legacyRemove: catchAsync(async (req, res) => {
    await explainerService.deleteExplainer(req.params.id);
    return ApiResponse.raw(res, { message: 'Explainer deleted successfully' });
  }),
};
