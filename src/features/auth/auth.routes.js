import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { googleLoginSchema, refreshSchema } from './auth.validation.js';

const router = Router();

router.post('/google', validate(googleLoginSchema), authController.googleLogin);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.get('/me', authenticate, authController.me);

export { router as authRoutes };
