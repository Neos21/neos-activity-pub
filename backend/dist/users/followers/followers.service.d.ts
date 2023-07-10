import { Repository } from 'typeorm';
import { ActorObjectService } from 'src/shared/services/actor-object.service';
import { Follower } from 'src/entities/follower';
export declare class FollowersService {
    private followersRepository;
    private actorObjectSerice;
    constructor(followersRepository: Repository<Follower>, actorObjectSerice: ActorObjectService);
    create(userName: string, actorObject: any): Promise<boolean>;
    findAll(userName: string): Promise<Array<Follower>>;
    remove(userName: string, actorObject: any): Promise<boolean>;
}
