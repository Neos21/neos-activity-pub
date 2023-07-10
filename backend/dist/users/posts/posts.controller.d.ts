import { Request, Response } from 'express';
import { PostsService } from './posts.service';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
    create(req: Request, text: string, res: Response): Promise<Response>;
}
