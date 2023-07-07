import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
export declare class WellKnownController {
    private readonly configService;
    private readonly usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    getHostMeta(res: Response): Response;
    getWebFinger(resource: string, res: Response): Promise<Response>;
}
