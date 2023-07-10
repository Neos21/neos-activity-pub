import { Response } from 'express';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { PostsService } from 'src/users/posts/posts.service';
export declare class APUsersNotesController {
    private hostUrlService;
    private postsService;
    constructor(hostUrlService: HostUrlService, postsService: PostsService);
    getNote(name: string, id: number, res: Response): Promise<Response>;
}
