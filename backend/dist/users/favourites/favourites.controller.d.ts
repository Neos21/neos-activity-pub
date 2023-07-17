import { Request, Response } from 'express';
import { FavouritesService } from './favourites.service';
export declare class FavouritesController {
    private favouritesService;
    constructor(favouritesService: FavouritesService);
    create(name: string, userName: string, postId: string, userId: string, req: Request, res: Response): Promise<Response>;
    findOne(name: string, postId: string, res: Response): Promise<Response>;
    remove(name: string, postId: string, req: Request, res: Response): Promise<Response>;
}
