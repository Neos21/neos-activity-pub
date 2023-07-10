import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
export declare class AccessLogMiddleware implements NestMiddleware {
    private logger;
    use(req: Request, _res: Response, next: NextFunction): void;
    private stringifyParam;
}
