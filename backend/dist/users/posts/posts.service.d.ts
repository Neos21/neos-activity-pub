import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { FollowersService } from '../followers/followers.service';
import { Post } from 'src/entities/post';
export declare class PostsService {
    private httpService;
    private postsRepository;
    private followersService;
    constructor(httpService: HttpService, postsRepository: Repository<Post>, followersService: FollowersService);
    create(userName: string, text: string): Promise<Post>;
    publishNote(post: Post): Promise<void>;
    private findOne;
}
