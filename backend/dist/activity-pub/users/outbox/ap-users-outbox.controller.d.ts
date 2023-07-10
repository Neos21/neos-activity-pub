import { Request, Response } from 'express';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from 'src/users/users.service';
export declare class APUsersOutboxController {
    private usersService;
    private hostUrlService;
    private logger;
    constructor(usersService: UsersService, hostUrlService: HostUrlService);
    outbox(name: string, req: Request, res: Response): Promise<Response>;
}
