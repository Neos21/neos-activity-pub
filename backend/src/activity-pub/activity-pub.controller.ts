import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { UsersService } from '../shared/services/users.service';

/** ActivityPub Controller */
@Controller('activity-pub')
export class ActivityPubController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) { }
  
  /** ユーザ情報を返す : https://qiita.com/wakin/items/94a0ff3f32f842b18a25 */
  @Get('users/:name')
  public async getUser(@Param('name') name: string, @Res() res: Response) {
    const isHttp = this.configService.get<number>('isHttp');
    const host   = this.configService.get<string>('host');
    const domain = `http${isHttp ? '' : 's'}//${host}`;
    
    const user = await this.usersService.findOneByName(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).send(`User [${name}] is not found.`);
    
    const json = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type   : 'Person',
      id     : `${domain}/@${user.name}`,  // Fediverse で一意
      name   : user.name,                  // 表示名
      preferredUsername: user.name,        // ユーザ ID
      summary: `Summary of ${user.name}`,  // 概要
      inbox  : `${domain}/api/activity-pub/users/${user.name}/inbox`,   // このユーザへの宛先
      outbox : `${domain}/api/activity-pub/users/${user.name}/outbox`,  // このユーザの発信元
      url    : `${domain}/@${user.name}`   // プロフィールページ
    };
    
    return res.status(HttpStatus.OK).type('application/activity+json').json(json);
  }
}
