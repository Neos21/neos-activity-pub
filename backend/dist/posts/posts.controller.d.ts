import { Request, Response } from 'express';
export declare class PostsController {
    create(req: Request, text: string, res: Response): Promise<Response>;
}
