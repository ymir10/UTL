// production ready logger
// use for logging process information, warnings and errors in files for future reference
// and debugging purposes


import winston from 'winston';

let CONFIG = {
        logFile: 'logger.log',
        errorFile: 'errors.log',
        warnFile: 'warnings.log',
        maxFiles: 6,
        maxsize: 10485760 // 10MB

}
function setConfig(config) {
  CONFIG = { ...CONFIG, ...config };
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: CONFIG.errorFile, 
      level: 'error',
      maxsize: CONFIG.maxsize,
      maxFiles: CONFIG.maxFiles
    }),
    new winston.transports.File({ 
      filename: CONFIG.logFile,
      maxsize: CONFIG.maxsize,
      maxFiles: CONFIG.maxFiles
    }),
    new winston.transports.File({ 
      filename: CONFIG.warnFile,
      level: 'warn',
      maxsize: CONFIG.maxsize,
      maxFiles: CONFIG.maxFiles
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});


export default logger;
export { setConfig };