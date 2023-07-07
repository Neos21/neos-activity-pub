import { Response } from 'express';
export declare class OutboxController {
    private readonly logger;
    outbox(name: string, body: any, res: Response): Response;
}
