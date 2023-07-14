import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { Following } from 'src/entities/following';
import { HostUrlService } from 'src/shared/services/host-url.service';
export declare class FollowingsService {
    private followingsRepository;
    private hostUrlService;
    constructor(followingsRepository: Repository<Following>, hostUrlService: HostUrlService);
    createLocalUser(userName: string, followingName: string): Promise<InsertResult>;
    createRemoteUser(userName: string, followingName: string, followingRemoteHost: string): void;
    findAll(userName: string): Promise<Array<Following>>;
    searchLocalUser(userName: string, followingName: string): Promise<Following>;
    removeLocalUser(userName: string, followingName: string): Promise<DeleteResult>;
}
