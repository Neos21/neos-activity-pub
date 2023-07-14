import { HttpService } from '@nestjs/axios';
import { ActorObjectService } from 'src/shared/services/actor-object.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from 'src/users/users.service';
export declare class SearchService {
    private httpService;
    private actorObjectService;
    private hostUrlService;
    private usersService;
    constructor(httpService: HttpService, actorObjectService: ActorObjectService, hostUrlService: HostUrlService, usersService: UsersService);
    search(query: string): Promise<any | null>;
    private searchUrl;
    private searchRemoteUser;
    private searchLocalUser;
}
