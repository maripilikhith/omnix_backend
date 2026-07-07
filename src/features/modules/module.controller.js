import { moduleService } from './module.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const moduleController = {
  listAll: catchAsync(async (req, res) => {
    const modules = await moduleService.getAllModulesAdmin();
    return ApiResponse.success(res, modules);
  }),

  create: catchAsync(async (req, res) => {
    const mod = await moduleService.createModule(req.body);
    return ApiResponse.created(res, mod);
  }),

  update: catchAsync(async (req, res) => {
    const mod = await moduleService.updateModule(req.params.id, req.body);
    return ApiResponse.success(res, mod);
  }),

  remove: catchAsync(async (req, res) => {
    await moduleService.deleteModule(req.params.id);
    return ApiResponse.success(res, { message: 'Module deleted successfully' });
  }),

  // ─── Legacy compat ──────────────────────────────────────────────
  legacyListAll: catchAsync(async (_req, res) => {
    const modules = await moduleService.getAllModulesAdmin();
    return ApiResponse.raw(res, modules);
  }),

  legacyCreate: catchAsync(async (req, res) => {
    const mod = await moduleService.createModule(req.body);
    return ApiResponse.raw(res, mod, 201);
  }),

  legacyUpdate: catchAsync(async (req, res) => {
    const mod = await moduleService.updateModule(req.params.id, req.body);
    return ApiResponse.raw(res, mod);
  }),

  legacyRemove: catchAsync(async (req, res) => {
    await moduleService.deleteModule(req.params.id);
    return ApiResponse.raw(res, { message: 'Module deleted successfully' });
  }),
};
