import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { FollowersService } from 'src/users/followers/followers.service';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class APUsersInboxController {
    private httpService;
    private usersService;
    private hostUrlService;
    private followersService;
    private notificationsService;
    private logger;
    constructor(httpService: HttpService, usersService: UsersService, hostUrlService: HostUrlService, followersService: FollowersService, notificationsService: NotificationsService);
    inbox(name: string, body: any, res: Response): Promise<Response>;
    private getActor;
    private acceptFollow;
}
