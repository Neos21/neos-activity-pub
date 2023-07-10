import { Response } from 'express';
import { FollowersService } from './followers.service';
import { UsersService } from '../users.service';
export declare class FollowersController {
    private followersService;
    private usersService;
    constructor(followersService: FollowersService, usersService: UsersService);
    findAll(name: string, res: Response): Promise<Response>;
}
