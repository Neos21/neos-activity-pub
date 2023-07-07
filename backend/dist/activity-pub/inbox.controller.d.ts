import { Request, Response } from 'express';
export declare class InboxController {
    private readonly logger;
    inbox(name: string, req: Request, res: Response): Response;
}
