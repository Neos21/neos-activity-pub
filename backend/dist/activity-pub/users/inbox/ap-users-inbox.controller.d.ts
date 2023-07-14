import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { FollowersService } from 'src/users/followers/followers.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { SignHeaderService } from 'src/activity-pub/sign-header.service';
export declare class APUsersInboxController {
    private httpService;
    private followersService;
    private hostUrlService;
    private notificationsService;
    private usersService;
    private signHeaderService;
    private logger;
    constructor(httpService: HttpService, followersService: FollowersService, hostUrlService: HostUrlService, notificationsService: NotificationsService, usersService: UsersService, signHeaderService: SignHeaderService);
    inbox(name: string, body: any, res: Response): Promise<Response>;
    private fetchActor;
    private onFollow;
    private onUnfollow;
    private acceptFollow;
    private onLike;
}
