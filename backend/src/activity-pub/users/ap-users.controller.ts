import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from 'src/users/users.service';

@Controller('api/activity-pub/users')
export class APUsersController {
  constructor(
    private hostUrlService: HostUrlService,
    private usersService: UsersService
  ) { }
  
  /** ユーザ情報を返す : https://qiita.com/wakin/items/94a0ff3f32f842b18a25 */
  @Get(':name')
  public async getUser(@Param('name') name: string, @Res() res: Response): Promise<Response> {
    const user = await this.usersService.findOneWithPublicKey(name);
    if(user == null) return res.status(HttpStatus.NOT_FOUND).send(`User [${name}] is not found.`);
    
    const fqdn = this.hostUrlService.fqdn;
    const json = {
      '@context': [
        'https://www.w3.org/ns/activitystreams',
        'https://w3id.org/security/v1'
      ],
      type   : 'Person',
      id     : `${fqdn}/api/activity-pub/users/${user.name}`,         // Fediverse で一意・ActivityPub を話せる URL であること
      name   : user.name,                                               // 表示名
      preferredUsername: user.name,                                     // ユーザ ID
      summary: `<p>User : ${user.name}</p>`,                            // 概要
      inbox  : `${fqdn}/api/activity-pub/users/${user.name}/inbox`,   // このユーザへの宛先
      outbox : `${fqdn}/api/activity-pub/users/${user.name}/outbox`,  // このユーザの発信元
      url    : `${fqdn}/api/activity-pub/users/${user.name}`,         // プロフィールページ
      manuallyApprovesFollowers: false,
      discoverable: true,
      published: `${user.createdAt.toISOString().slice(0, 10)}T00:00:00Z`,  // 登録日 `YYYY-MM-DDTHH:mm:SSZ`
      publicKey: {
        id          : `${fqdn}/api/activity-pub/users/${user.name}#main-key`,
        owner       : `${fqdn}/api/activity-pub/users/${user.name}`,  // `id` と一致させる
        publicKeyPem: user.publicKey
      },
      tag: [],
      attachment: [],  // 追加リンク部分
      icon: {  // アイコン
        type: 'Image',
        mediaType: 'image/jpeg',
        url: `${fqdn}/assets/icon.jpg`
      },
      image: {  // ヘッダ背景
        type: 'Image',
        mediaType: 'image/jpeg',
        url: `${fqdn}/assets/icon.jpg`
      }
    };
    return res.status(HttpStatus.OK).type('application/activity+json').json(json);
  }
}
