import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HostUrlService {
  /** ホスト名 (`example.com` の形) */
  public host: string;
  /** HTTP か否か (`false` なら HTTPS) */
  public isHttp: boolean;
  /** FQDN (`https://example.com` の形) */
  public fqdn: string;
  
  constructor(private configService: ConfigService) {
    this.host   = this.configService.get<string>('host');
    this.isHttp = this.configService.get<boolean>('isHttp');
    this.fqdn   = `http${this.isHttp ? '' : 's'}://${this.host}`;
  }
}
