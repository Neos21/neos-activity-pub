import { Response } from 'express';
import { UsersService } from './users.service';
import { User } from 'src/entities/user';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(user: User, res: Response): Promise<Response>;
    findAll(res: Response): Promise<Response>;
    findOne(name: string, res: Response): Promise<Response>;
}
