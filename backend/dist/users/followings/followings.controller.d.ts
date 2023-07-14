import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { FollowingsService } from './followings.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from '../users.service';
export declare class FollowingsController {
    private httpService;
    private followingsService;
    private hostUrlService;
    private usersService;
    constructor(httpService: HttpService, followingsService: FollowingsService, hostUrlService: HostUrlService, usersService: UsersService);
    create(name: string, userName: string, followingName: string, followingRemoteHost: string, req: Request, res: Response): Promise<Response>;
    findAll(name: string, res: Response): Promise<Response>;
    search(name: string, userName: string, followingName: string, followingRemoteHost: string, req: Request, res: Response): Promise<Response>;
    remove(name: string, userName: string, followingName: string, followingRemoteHost: string, req: Request, res: Response): Promise<Response>;
}
