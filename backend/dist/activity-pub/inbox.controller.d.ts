import { Response } from 'express';
export declare class InboxController {
    private readonly logger;
    inbox(name: string, body: any, res: Response): Response;
}
