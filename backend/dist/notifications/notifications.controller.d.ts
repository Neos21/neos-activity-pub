import { Request, Response } from 'express';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: Request, res: Response): Promise<Response>;
}
