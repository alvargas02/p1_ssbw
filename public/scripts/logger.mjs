// logger.mjs
import winston from 'winston';
const { combine, timestamp, printf, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),              // todo a consola
    new winston.transports.File({                  // info y superior
      filename: 'app.log',
      level: 'info'
    }),
    new winston.transports.File({                  // solo errores
      filename: 'error.log',
      level: 'error'
    })
  ],
});

export default logger;
