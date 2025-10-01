import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const uuidMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.setHeader('X-Correlation-ID', uuidv4());
    next();
};
