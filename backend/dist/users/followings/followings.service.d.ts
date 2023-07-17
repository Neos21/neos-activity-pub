import { HttpService } from '@nestjs/axios';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { Following } from 'src/entities/following';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { SignHeaderService } from 'src/activity-pub/sign-header.service';
import { UsersService } from '../users.service';
export declare class FollowingsService {
    private httpService;
    private followingsRepository;
    private hostUrlService;
    private signHeaderService;
    private usersService;
    constructor(httpService: HttpService, followingsRepository: Repository<Following>, hostUrlService: HostUrlService, signHeaderService: SignHeaderService, usersService: UsersService);
    postFollowInboxToLocalUser(userName: string, followingName: string): Promise<any>;
    fetchActor(followingName: string, followingRemoteHost: string): Promise<{
        objectUrl: string;
        inboxUrl: string;
    }>;
    postFollowInboxToRemoteUser(userName: string, inboxUrl: string, objectUrl: string): Promise<any>;
    createLocalUser(userName: string, followingName: string): Promise<InsertResult>;
    createRemoteUser(userName: string, followingName: string, followingRemoteHost: string, objectUrl: string, inboxUrl: string): Promise<InsertResult>;
    findAll(userName: string): Promise<Array<Following>>;
    searchLocalUser(userName: string, followingName: string): Promise<Following | null>;
    searchRemoteUser(userName: string, followingName: string, followingRemoteHost: string): Promise<Following | null>;
    postUnfollowInboxToLocalUser(userName: string, followingName: string): Promise<any>;
    postUnfollowInboxToRemoteUser(userName: string, followingName: string, objectUrl: string, inboxUrl: string): Promise<any>;
    removeLocalUser(userName: string, followingName: string): Promise<DeleteResult>;
    removeRemoteUser(userName: string, followingName: string, followingRemoteHost: string): Promise<DeleteResult>;
}
