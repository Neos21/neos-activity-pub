import { Request, Response } from 'express';
export declare class PostsController {
    create(req: Request, paramName: string, text: string, res: Response): Promise<Response>;
}
