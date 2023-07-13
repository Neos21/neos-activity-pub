import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
export declare class AppController {
    private httpService;
    constructor(httpService: HttpService);
    test(res: Response): Promise<Response>;
}
