import logger from '../config/logger';

export function handleError({ funcName, error }: { funcName: string, error: unknown }) {
    if (error instanceof Error) {
        logger.error({
            funcName,
            message: error.message,
            stack:   error.stack,
        });
    }
    else {
        logger.error({
            funcName,
            message: error,
        });
    }
}
