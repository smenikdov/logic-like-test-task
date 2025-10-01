import winston from 'winston';

class Logger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                winston.format.errors({ stack: true }),
                winston.format.printf(({ level, message, timestamp, meta }) => {
                    const msg = {
                        timestamp: timestamp,
                        type:      level,
                        msg:       message || '',
                        meta:      meta,
                    };

                    return JSON.stringify(msg);
                }),
            ),
            transports: [
                new winston.transports.Console({}),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                }),
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
            ],
        });
    }

    debug(message: any, meta?: any) {
        this.logger.debug({ message, meta });
    }

    info(message: any, meta?: any) {
        this.logger.info({ message, meta });
    }

    warn(message: any, meta?: any) {
        this.logger.warn({ message, meta });
    }

    error(message: any, meta?: any) {
        this.logger.error({ message, meta });
    }
}

const logger = new Logger();

export default logger;
