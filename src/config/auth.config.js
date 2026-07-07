/**
 * JWT authentication configuration.
 */
export const authConfig = Object.freeze({
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
});
