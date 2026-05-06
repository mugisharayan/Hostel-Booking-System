const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel =
  process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const shouldLog = (level) => levels[level] <= levels[currentLevel];

const writeLog = (level, message, meta) => {
  if (!shouldLog(level)) {
    return;
  }

  const method = level === 'debug' ? 'log' : level;
  const prefix = `[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`;

  if (meta === undefined) {
    console[method](prefix);
    return;
  }

  console[method](prefix, meta);
};

const logger = {
  error: (message, meta) => writeLog('error', message, meta),
  warn: (message, meta) => writeLog('warn', message, meta),
  info: (message, meta) => writeLog('info', message, meta),
  debug: (message, meta) => writeLog('debug', message, meta)
};

export default logger;
