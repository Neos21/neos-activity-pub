import { Response } from 'express';
import { User } from '../entities/user';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(user: User, res: Response): Promise<Response>;
    findOne(name: string, res: Response): Promise<Response>;
}
