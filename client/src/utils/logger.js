// Centralized logging utility
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;
  }

  error(message, data = null) {
    if (this.level >= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, data);
    }
  }

  warn(message, data = null) {
    if (this.level >= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data);
    }
  }

  info(message, data = null) {
    if (this.level >= LOG_LEVELS.INFO) {
      console.info(`[INFO] ${new Date().toISOString()}: ${message}`, data);
    }
  }

  debug(message, data = null) {
    if (this.level >= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`, data);
    }
  }
}

export const logger = new Logger();