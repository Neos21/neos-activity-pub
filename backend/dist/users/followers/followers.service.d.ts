import { Repository } from 'typeorm';
import { Follower } from 'src/entities/follower';
import { ActorObjectService } from 'src/shared/services/actor-object.service';
export declare class FollowersService {
    private followersRepository;
    private actorObjectSerice;
    constructor(followersRepository: Repository<Follower>, actorObjectSerice: ActorObjectService);
    create(userName: string, actorObject: any): Promise<boolean>;
    findAll(userName: string): Promise<Array<Follower>>;
}
