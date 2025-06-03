// packages/backend/src/utils/logger.ts

import pino, { stdTimeFunctions } from 'pino';

// Use environment variable for log path, or default to a safe location
const logPath = process.env.LOG_PATH || './logs/app.log';

// Create logger that writes to file in JSON format
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: stdTimeFunctions.isoTime,
}, pino.destination(logPath));

export default logger;


