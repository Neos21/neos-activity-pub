import { Repository } from 'typeorm';
import { Notification } from 'src/entities/notification';
import { ActorObjectService } from 'src/shared/services/actor-object.service';
export declare class NotificationsService {
    private notificationsRepository;
    private actorObjectSerice;
    private logger;
    constructor(notificationsRepository: Repository<Notification>, actorObjectSerice: ActorObjectService);
    createFollow(userName: string, actorObject: any): Promise<boolean>;
    findAll(userName: string): Promise<Array<Notification>>;
}
