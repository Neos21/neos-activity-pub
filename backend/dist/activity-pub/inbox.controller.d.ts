import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { HostUrlService } from '../shared/services/host-url/host-url.service';
import { UsersService } from '../users/users.service';
export declare class InboxController {
    private readonly httpService;
    private readonly usersService;
    private readonly hostUrlService;
    private readonly logger;
    constructor(httpService: HttpService, usersService: UsersService, hostUrlService: HostUrlService);
    inbox(name: string, req: Request, res: Response): Promise<Response>;
    private acceptFollow;
    private getInboxUrl;
}
