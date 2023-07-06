import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { UsersService } from '../users/users.service';

@Controller('.well-known')
export class WellKnownController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) { }
  
  /**
   * Get Host Meta
   * 
   * @return Host Meta
   */
  @Get('host-meta')
  public getHostMeta(@Res() res: Response): Response {
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
  public async getWebFinger(@Query('resource') resource: string, @Res() res: Response): Promise<Response> {
    if(resource == null || !resource.startsWith('acct:')) return res.status(HttpStatus.BAD_REQUEST).send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
    
    const isHttp = this.configService.get<number>('isHttp');
    const host = this.configService.get<string>('host');
    const name = resource.replace('acct:', '').replace(`@${host}`, '');
    
    const user = await this.usersService.findOne(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).send(`Actor [${resource}] is not found.`);
    
    const json = {
      subject: `acct:${user.name}@${host}`,
      links: [{
        rel : 'self',
        type: 'application/activity+json',
        href: `http${isHttp ? '' : 's'}://${host}/api/activity-pub/users/${user.name}`
      }]
    };
    return res.status(HttpStatus.OK).type('application/jrd+json').json(json);
  }
}
