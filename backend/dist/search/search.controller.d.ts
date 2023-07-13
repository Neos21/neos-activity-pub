import { Response } from 'express';
import { SearchService } from './search.service';
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    search(query: string, res: Response): Promise<Response>;
}
