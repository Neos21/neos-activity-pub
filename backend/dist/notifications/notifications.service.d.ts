import { Repository } from 'typeorm';
import { ActorObjectService } from 'src/shared/services/actor-object.service';
import { Notification } from 'src/entities/notification';
export declare class NotificationsService {
    private notificationsRepository;
    private actorObjectSerice;
    constructor(notificationsRepository: Repository<Notification>, actorObjectSerice: ActorObjectService);
    createFollow(userName: string, actorObject: any): Promise<boolean>;
    findAll(userName: string): Promise<Array<Notification>>;
}
