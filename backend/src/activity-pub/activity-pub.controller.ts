import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

/** ActivityPub Controller */
@Controller('activity-pub')
export class ActivityPubController {
  constructor(private configService: ConfigService) { }
  
  /** ユーザ情報を返す : https://qiita.com/wakin/items/94a0ff3f32f842b18a25 */
  @Get('/users/:name')
  public getUser(@Param('name') name: string, @Res() res: Response) {
    const host = this.configService.get<string>('host');
    const displayName = 'TODO';  // TODO
    
    const json = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type   : 'Person',
      id     : `https://${host}/@${name}`,              // Fediverse で一意
      name   : displayName,                             // 表示名
      preferredUsername: name,                          // ユーザID
      summary: 'Summary',                               // 概要
      inbox  : `https://${host}/users/${name}/inbox`,   // このユーザへの宛先
      outbox : `https://${host}/users/${name}/outbox`,  // このユーザの発信元
      url    : `https://${host}/@${name}`               // プロフィールページ
    };
    
    return res.status(HttpStatus.OK).type('application/activity+json').json(json);
  }
}
