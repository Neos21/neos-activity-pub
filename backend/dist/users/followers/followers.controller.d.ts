import { Response } from 'express';
import { FollowersService } from './followers.service';
import { UsersService } from '../users.service';
export declare class FollowersController {
    private usersService;
    private followersService;
    constructor(usersService: UsersService, followersService: FollowersService);
    findAll(name: string, res: Response): Promise<Response>;
}
