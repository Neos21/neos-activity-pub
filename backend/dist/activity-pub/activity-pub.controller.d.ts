import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
export declare class ActivityPubController {
    private readonly configService;
    private readonly usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    getUser(name: string, res: Response): Promise<Response>;
    getNote(name: string, res: Response): Response;
}
