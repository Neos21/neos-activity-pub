import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { FollowersService } from '../followers/followers.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { SignHeaderService } from 'src/activity-pub/sign-header.service';
import { UsersService } from '../users.service';
import { Post } from 'src/entities/post';
export declare class PostsService {
    private httpService;
    private postsRepository;
    private followersService;
    private hostUrlService;
    private signHeaderService;
    private usersService;
    constructor(httpService: HttpService, postsRepository: Repository<Post>, followersService: FollowersService, hostUrlService: HostUrlService, signHeaderService: SignHeaderService, usersService: UsersService);
    create(userName: string, text: string): Promise<Post>;
    publishNote(post: Post): Promise<void>;
    private findOne;
    private renderCreateNote;
}
