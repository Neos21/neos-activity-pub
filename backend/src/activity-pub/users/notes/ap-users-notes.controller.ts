import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { HostUrlService } from 'src/shared/services/host-url.service';

@Controller('api/activity-pub/users')
export class APUsersNotesController {
  constructor(private hostUrlService: HostUrlService) { }
  
  // TODO
  @Get(':name/notes/:id')
  public getNote(@Param('name') name: string, @Param('id') id: number, @Res() res: Response): Response {
    const fqdn = this.hostUrlService.fqdn;
    const json = {
      '@context'  : 'https://www.w3.org/ns/activitystreams',
      type        : 'Note',
      id          : `${fqdn}/api/activity-pub/users/${name}/notes/${id}`,  // Fediverse で一意
      attributedTo: `${fqdn}/api/activity-pub/users/${name}`,              // 投稿者の `Person#id`・このエンドポイントにアクセスできないと投稿が認識されない
      content     : `<p>仮投稿 ${name} ${id}</p>`,                         // XHTML で記述された投稿内容
      published   : '2023-07-07T00:00:00+09:00',                           // ISO 形式の投稿日時
      to: [                                                                // 公開範囲
        'https://www.w3.org/ns/activitystreams#Public',                    // 公開
        `${fqdn}/api/activity-pub/users/${name}/followers`,                // フォロワー
      ]
    };
    return res.status(HttpStatus.OK).type('application/activity+json').json(json);
  }
}
