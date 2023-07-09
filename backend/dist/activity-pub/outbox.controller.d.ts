import { Request, Response } from 'express';
import { HostUrlService } from '../shared/services/host-url/host-url.service';
import { UsersService } from '../users/users.service';
export declare class OutboxController {
    private readonly usersService;
    private readonly hostUrlService;
    private readonly logger;
    constructor(usersService: UsersService, hostUrlService: HostUrlService);
    outbox(name: string, req: Request, res: Response): Promise<Response>;
}
