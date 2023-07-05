import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('.well-known')
export class WellKnownController {
  constructor(private configService: ConfigService) { }
  
  /**
   * Get Host Meta
   * 
   * @return Host Meta
   */
  @Get('host-meta')
  public getHostMeta(@Res() res: Response) {
    const host = this.configService.get<string>('host');
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
      + '<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">\n'
      + '  <Link rel="lrdd" template="https://' + host + '/.well-known/webfinger?resource={uri}"/>\n'
      + '</XRD>\n';
    return res.status(HttpStatus.OK).type('application/xrd+xml').send(xml);
  }
  
  /**
   * Get WebFinger
   * 
   * @param resource Resource
   * @return WebFinger
   */
  @Get('webfinger')
  public getWebFinger(@Query('resource') resource: string, @Res() res: Response) {
    if(!resource.startsWith('acct:')) return res.status(HttpStatus.BAD_REQUEST).send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
    
    const host = this.configService.get<string>('host');
    const name = resource.replace('acct:', '').replace(`@${host}`, '');  // TODO : 存在チェックする
    
    const json = {
      subject: `acct:${name}@${host}`,
      links: [{
        rel : 'self',
        type: 'application/activity+json',
        href: `https://${host}/api/activity-pub/users/@${name}`
      }]
    };
    return res.status(HttpStatus.OK).type('application/jrd+json').json(json);
  }
}
