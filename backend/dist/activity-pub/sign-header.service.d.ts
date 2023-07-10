import { HostUrlService } from 'src/shared/services/host-url.service';
export declare class SignHeaderService {
    private hostUrlService;
    constructor(hostUrlService: HostUrlService);
    signHeader(json: any, inboxUrl: string, userName: string, privateKey: string): any;
}
