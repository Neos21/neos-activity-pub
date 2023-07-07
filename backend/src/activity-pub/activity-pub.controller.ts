import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { HostUrlService } from '../shared/services/host-url/host-url.service';
import { UsersService } from '../users/users.service';

@Controller('api/activity-pub')
export class ActivityPubController {
  constructor(
    private readonly hostUrlService: HostUrlService,
    private readonly usersService: UsersService
  ) { }
  
  /** ユーザ情報を返す : https://qiita.com/wakin/items/94a0ff3f32f842b18a25 */
  @Get('users/:name')
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
      published: '2023-07-07T00:00:00Z',  // TODO : 登録日
      publicKey: {
        id          : `${fqdn}/api/activity-pub/users/${user.name}#main-key`,
        owner       : `${fqdn}/api/activity-pub/users/${user.name}`,  // `id` と一致させる
        publicKeyPem: user.publicKey
      },
      tag: [],
      attachment: [],  // 追加リンク部分
      icon: {
        type: 'Image',
        mediaType: 'image/jpeg',
        url: `${fqdn}/assets/icon.jpg`
      },
      image: {
        type: 'Image',
        mediaType: 'image/jpeg',
        url: `${fqdn}/assets/icon.jpg`
      }
    };
    return res.status(HttpStatus.OK).type('application/activity+json').json(json);
  }
  
  // TODO : お試しでノート情報を返す
  @Get('users/:name/note')
  public getNote(@Param('name') name: string, @Res() res: Response): Response {
    const fqdn = this.hostUrlService.fqdn;
    const json = {
      '@context'  : 'https://www.w3.org/ns/activitystreams',
      type        : 'Note',
      id          : `${fqdn}/api/activity-pub/users/${name}/note`,  // Fediverse で一意
      attributedTo: `${fqdn}/api/activity-pub/users/${name}`,       // 投稿者の `Person#id`・このエンドポイントにアクセスできないと投稿が認識されない
      content     : `<p>仮投稿 ${name}</p>`,                          // XHTML で記述された投稿内容
      published   : '2023-07-07T00:00:00+09:00',                      // ISO 形式の投稿日時
      to: [                                                           // 公開範囲
        'https://www.w3.org/ns/activitystreams#Public',               // 公開
        `${fqdn}/api/activity-pub/users/${name}/follower`,          // フォロワー
      ]
    };
    return res.status(HttpStatus.OK).type('application/activity+json').json(json);
  }
}
