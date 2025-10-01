import type { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    logger.error({
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        correlationId: res.getHeader('X-Correlation-ID'),
    });

    res.status(500).json({
        error: 'Internal Server Error',
        correlationId: res.getHeader('X-Correlation-ID'),
    });
};
