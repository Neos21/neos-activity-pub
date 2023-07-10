import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from 'src/users/users.service';

@Controller('.well-known')
export class WellKnownController {
  constructor(
    private hostUrlService: HostUrlService,
    private usersService: UsersService
  ) { }
  
  /**
   * Host Meta を返す
   * 
   * @param res Response
   * @return Host Meta
   */
  @Get('host-meta')
  public getHostMeta(@Res() res: Response): Response {
    const fqdn = this.hostUrlService.fqdn;
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
      + '<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">\n'
      + '  <Link rel="lrdd" template="' + fqdn + '/.well-known/webfinger?resource={uri}"/>\n'
      + '</XRD>\n';
    return res.status(HttpStatus.OK).type('application/xrd+xml').send(xml);
  }
  
  /**
   * WebFinger を返す
   * 
   * @param resource Resource
   * @param res Response
   * @return WebFinger
   */
  @Get('webfinger')
  public async getWebFinger(@Query('resource') resource: string, @Res() res: Response): Promise<Response> {
    if(resource == null || !resource.startsWith('acct:')) return res.status(HttpStatus.BAD_REQUEST).send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
    
    const host = this.hostUrlService.host;
    const fqdn = this.hostUrlService.fqdn;
    const name = resource.replace('acct:', '').replace(`@${host}`, '');
    const user = await this.usersService.findOne(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).send(`Actor [${resource}] is not found.`);
    
    const json = {
      subject: `acct:${user.name}@${host}`,
      aliases: [
        `${fqdn}/api/activity-pub/users/${user.name}`
      ],
      links: [
        {
          rel : 'self',
          type: 'application/activity+json',
          href: `${fqdn}/api/activity-pub/users/${user.name}`
        },
        {
          rel : 'http://webfinger.net/rel/profile-page',
          type: 'text/html',
          href: `${fqdn}/@${name}`
        },
        {
          rel: 'http://ostatus.org/schema/1.0/subscribe',
          template: `${fqdn}/authorize-follow?uri={uri}`  // TODO : フォロー画面への遷移
        }
      ]
    };
    return res.status(HttpStatus.OK).type('application/jrd+json').json(json);
  }
}
