import { HostUrlService } from './host-url.service';
export declare class ActorObjectService {
    private hostUrlService;
    constructor(hostUrlService: HostUrlService);
    getRemoteHost(actorObject: any): string | undefined;
    getActorUserName(actorObject: any): string;
    getFullName(actorObject: any): string;
}
