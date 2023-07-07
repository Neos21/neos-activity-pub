import { Response } from 'express';
import { HostUrlService } from '../shared/services/host-url/host-url.service';
import { UsersService } from '../users/users.service';
export declare class ActivityPubController {
    private readonly hostUrlService;
    private readonly usersService;
    constructor(hostUrlService: HostUrlService, usersService: UsersService);
    getUser(name: string, res: Response): Promise<Response>;
    getNote(name: string, res: Response): Response;
}
