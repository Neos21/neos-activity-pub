import { Response } from 'express';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from 'src/users/users.service';
export declare class WellKnownController {
    private hostUrlService;
    private usersService;
    constructor(hostUrlService: HostUrlService, usersService: UsersService);
    getHostMeta(res: Response): Response;
    getWebFinger(resource: string, res: Response): Promise<Response>;
}
