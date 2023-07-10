import { Request, Response } from 'express';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from 'src/users/users.service';
export declare class APUsersOutboxController {
    private hostUrlService;
    private usersService;
    private logger;
    constructor(hostUrlService: HostUrlService, usersService: UsersService);
    outbox(name: string, req: Request, res: Response): Promise<Response>;
}
