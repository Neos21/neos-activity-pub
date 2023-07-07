import { Response } from 'express';
import { HostUrlService } from '../shared/services/host-url/host-url.service';
import { UsersService } from '../users/users.service';
export declare class WellKnownController {
    private readonly hostUrlService;
    private readonly usersService;
    constructor(hostUrlService: HostUrlService, usersService: UsersService);
    getHostMeta(res: Response): Response;
    getWebFinger(resource: string, res: Response): Promise<Response>;
}
