import { Request, Response } from 'express';
import { PostsService } from './posts.service';
import { UsersService } from '../users.service';
export declare class PostsController {
    private postsService;
    private usersService;
    constructor(postsService: PostsService, usersService: UsersService);
    create(name: string, req: Request, text: string, res: Response): Promise<Response>;
    findAll(name: string, res: Response): Promise<Response>;
}
