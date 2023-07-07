import { ConfigService } from '@nestjs/config';
export declare class HostUrlService {
    private readonly configService;
    host: string;
    isHttp: boolean;
    fqdn: string;
    constructor(configService: ConfigService);
}
