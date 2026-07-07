import { authService } from './auth.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

/**
 * Auth controller — handles Google OAuth login, token refresh, and user profile.
 */
export const authController = {
  /**
   * POST /auth/google
   * Verify Google ID token, find or create user, return JWT tokens.
   */
  googleLogin: catchAsync(async (req, res) => {
    const { idToken } = req.body;

    // 1. Verify the Google ID token
    const googleProfile = await authService.verifyGoogleToken(idToken);

    // 2. Find existing user or create new one
    const user = await authService.findOrCreateUser(googleProfile);

    // 3. Generate our own JWT tokens
    const tokens = authService.generateTokenPair(user);

    return ApiResponse.success(res, {
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
      },
      ...tokens,
    });
  }),

  /**
   * POST /auth/refresh
   * Exchange a valid refresh token for a new access token.
   */
  refresh: catchAsync(async (req, res) => {
    const { refreshToken } = req.body;

    // Verify the refresh token
    const decoded = authService.verifyRefreshToken(refreshToken);

    // Get fresh user data
    const user = await authService.getUserById(decoded.id);

    // Generate new token pair
    const tokens = authService.generateTokenPair(user);

    return ApiResponse.success(res, {
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
      },
      ...tokens,
    });
  }),

  /**
   * GET /auth/me
   * Return the authenticated user's profile.
   */
  me: catchAsync(async (req, res) => {
    const user = await authService.getUserById(req.user.id);

    return ApiResponse.success(res, {
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
      },
    });
  }),
};
