/**
 * Application-level configuration.
 */
export const appConfig = Object.freeze({
  name: 'Omnix',
  version: '2.0.0',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5001,
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  logLevel: process.env.LOG_LEVEL || 'debug',
});
