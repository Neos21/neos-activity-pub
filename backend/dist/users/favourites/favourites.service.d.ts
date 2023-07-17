import { HttpService } from '@nestjs/axios';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { SignHeaderService } from 'src/activity-pub/sign-header.service';
import { UsersService } from '../users.service';
import { Favourite } from 'src/entities/favourite';
export declare class FavouritesService {
    private httpService;
    private favouritesRepository;
    private hostUrlService;
    private signHeaderService;
    private usersService;
    constructor(httpService: HttpService, favouritesRepository: Repository<Favourite>, hostUrlService: HostUrlService, signHeaderService: SignHeaderService, usersService: UsersService);
    fetchInboxUrl(actorUrl: string): Promise<string>;
    postLikeInbox(userName: string, inboxUrl: string, postId: string): Promise<any>;
    create(userName: string, postUrl: string, inboxUrl: string): Promise<InsertResult>;
    findOne(userName: string, postUrl: string): Promise<Favourite | null>;
    postUnlikeInbox(userName: string, inboxUrl: string, postId: string): Promise<any>;
    remove(userName: string, postUrl: string): Promise<DeleteResult>;
}
