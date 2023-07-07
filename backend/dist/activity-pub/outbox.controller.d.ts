import { Request, Response } from 'express';
export declare class OutboxController {
    private readonly logger;
    outbox(name: string, req: Request, res: Response): Response;
}
