import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { FollowingsService } from './followings.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
export declare class FollowingsController {
    private httpService;
    private followingsService;
    private hostUrlService;
    constructor(httpService: HttpService, followingsService: FollowingsService, hostUrlService: HostUrlService);
    create(name: string, userName: string, followingName: string, followingRemoteHost: string, req: Request, res: Response): Promise<Response>;
    search(name: string, userName: string, followingName: string, followingRemoteHost: string, req: Request, res: Response): Promise<Response>;
    remove(name: string, userName: string, followingName: string, followingRemoteHost: string, req: Request, res: Response): Promise<Response>;
}
