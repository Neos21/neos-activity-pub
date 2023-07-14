import { HostUrlService } from './host-url.service';
export declare class ActorObjectService {
    private hostUrlService;
    constructor(hostUrlService: HostUrlService);
    getRemoteHost(url: string): string | null;
    getFullName(actorObject: any): string;
}
