import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { HostUrlService } from 'src/shared/services/host-url.service';
import { PostsService } from 'src/users/posts/posts.service';

@Controller('api/activity-pub/users')
export class APUsersNotesController {
  constructor(
    private hostUrlService: HostUrlService,
    private postsService: PostsService,
  ) { }
  
  /** ノート情報を返す */
  @Get(':name/notes/:id')
  public async getNote(@Param('name') name: string, @Param('id') id: number, @Res() res: Response): Promise<Response> {
    const post = await this.postsService.findOne(id);
    if(post == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Post Not Found' });
    if(name !== post.userName) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });  // ユーザ名不一致
    const fqdn = this.hostUrlService.fqdn;
    const json = {
      '@context'  : 'https://www.w3.org/ns/activitystreams',
      type        : 'Note',
      id          : `${fqdn}/api/activity-pub/users/${post.userName}/notes/${post.id}`,  // Fediverse で一意
      attributedTo: `${fqdn}/api/activity-pub/users/${post.userName}`,                   // 投稿者の `Person#id`・このエンドポイントにアクセスできないと投稿が認識されない
      content     : post.text,                                                           // XHTML で記述された投稿内容
      published   : post.createdAt.toISOString().slice(0, 19) + 'Z',                     // ISO 形式の投稿日時 `YYYY-MM-DDTHH:mm:SSZ`
      to: [                                                                              // 公開範囲
        'https://www.w3.org/ns/activitystreams#Public',                                  // 公開
        `${fqdn}/api/activity-pub/users/${name}/followers`,                              // フォロワー
      ]
    };
    return res.status(HttpStatus.OK).type('application/activity+json').json(json);
  }
}
