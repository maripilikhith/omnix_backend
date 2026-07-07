import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import config from '../../config/index.js';
import { AuthenticationError } from '../../utils/ApiError.js';
import { ERROR_CODES } from '../../constants/index.js';
import { UserModel } from './user.model.js';

const googleClient = new OAuth2Client(config.auth.googleClientId);

/**
 * Authentication service — handles Google OAuth, user management, and token lifecycle.
 */
export class AuthService {
  /**
   * Hash a plaintext password.
   */
  async hashPassword(password) {
    return bcrypt.hash(password, config.auth.saltRounds);
  }

  /**
   * Compare a plaintext password with a hash.
   */
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT access token.
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtExpiresIn,
    });
  }

  /**
   * Generate a JWT refresh token.
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, config.auth.jwtRefreshSecret, {
      expiresIn: config.auth.jwtRefreshExpiresIn,
    });
  }

  /**
   * Verify a refresh token.
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.auth.jwtRefreshSecret);
    } catch {
      throw new AuthenticationError('Invalid refresh token', ERROR_CODES.AUTH_TOKEN_INVALID);
    }
  }

  /**
   * Generate both access and refresh tokens.
   */
  generateTokenPair(user) {
    const payload = { id: user._id || user.id, email: user.email, role: user.role };
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify a Google ID token and extract user profile information.
   * @param {string} idToken - The Google ID token from the frontend
   * @returns {object} - { googleId, email, displayName, avatar }
   */
  async verifyGoogleToken(idToken) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: config.auth.googleClientId,
      });
      const payload = ticket.getPayload();

      return {
        googleId: payload.sub,
        email: payload.email,
        displayName: payload.name,
        avatar: payload.picture || '',
      };
    } catch (err) {
      throw new AuthenticationError(
        'Invalid Google token',
        ERROR_CODES.AUTH_TOKEN_INVALID,
      );
    }
  }

  /**
   * Find an existing user by googleId, or create a new one.
   * Updates lastLoginAt and profile info on every login.
   * @param {object} googleProfile - { googleId, email, displayName, avatar }
   * @returns {object} - The user document
   */
  async findOrCreateUser(googleProfile) {
    const { googleId, email, displayName, avatar } = googleProfile;

    let user = await UserModel.findOne({ googleId });

    if (user) {
      // Existing user — update profile and login timestamp
      user.displayName = displayName;
      user.avatar = avatar;
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      // Check if email already exists with a different Google account
      const existingByEmail = await UserModel.findOne({ email });
      if (existingByEmail) {
        throw new AuthenticationError(
          'An account with this email already exists',
          ERROR_CODES.AUTH_EMAIL_EXISTS,
        );
      }

      // New user — create with default student role
      user = await UserModel.create({
        googleId,
        email,
        displayName,
        avatar,
        lastLoginAt: new Date(),
      });
    }

    return user;
  }

  /**
   * Get user by ID.
   * @param {string} userId
   * @returns {object} - The user document
   */
  async getUserById(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found', ERROR_CODES.USER_NOT_FOUND);
    }
    return user;
  }
}

export const authService = new AuthService();
