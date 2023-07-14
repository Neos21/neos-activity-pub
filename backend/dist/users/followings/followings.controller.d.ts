import { Request, Response } from 'express';
import { FollowingsService } from './followings.service';
import { UsersService } from '../users.service';
export declare class FollowingsController {
    private followingsService;
    private usersService;
    constructor(followingsService: FollowingsService, usersService: UsersService);
    create(name: string, req: Request, followingName: string, followingRemoteHost: string, res: Response): Promise<Response>;
}
