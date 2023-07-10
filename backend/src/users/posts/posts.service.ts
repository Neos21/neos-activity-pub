import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { FollowersService } from '../followers/followers.service';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { SignHeaderService } from 'src/activity-pub/sign-header.service';
import { UsersService } from '../users.service';

import { Post } from 'src/entities/post';

@Injectable()
export class PostsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private followersService: FollowersService,
    private hostUrlService: HostUrlService,
    private signHeaderService: SignHeaderService,
    private usersService: UsersService,
  ) { }
  
  /**
   * 投稿を登録する
   * 
   * @return 登録できた投稿情報
   * @throws バリデーションエラー時、登録失敗時
   */
  public async create(userName: string, text: string): Promise<Post> {
    if(text == null || text === '') throw new Error('Invalid Text');  // 空値は弾く
    const post = new Post({ userName, text: `<p>${text.replace((/\n/g), '<br>')}</p>` });  // XHTML 形式で保存する
    const insertResult = await this.postsRepository.insert(post);  // Throws
    const createdId = insertResult.identifiers?.[0]?.id;
    if(createdId == null) throw new Error('Failed To Insert Post');
    return this.findOne(createdId);
  }
  
  /** フォロワーを取得し、そのフォロワーの Inbox に Create を投げる (TODO : BullMQ でやりたい) */
  public async publishNote(post: Post): Promise<void> {
    const user = await this.usersService.findOneWithPrivateKey(post.userName);
    const followers = await this.followersService.findAll(post.userName);
    const json = this.renderCreateNote(post);
    for(const follower of followers) {
      const requestHeaders = this.signHeaderService.signHeader(json, follower.inboxUrl, user.name, user.privateKey);
      await firstValueFrom(this.httpService.post(follower.inboxUrl, JSON.stringify(json), { headers: requestHeaders })).catch(_error => null);
    }
  }
  
  /** 投稿を新しいモノから順番に一覧で返す https://typeorm.io/#using-querybuilder */
  public findAll(userName: string): Promise<Array<Post>> {
    return this.postsRepository.createQueryBuilder('posts')
      .where('posts.userName = :userName')
      .orderBy('posts.createdAt', 'DESC')
      .take(50)  // 最大50件に絞る
      .setParameters({ userName })
      .getMany();
  }
  
  public findOne(id: number): Promise<Post> {
    return this.postsRepository.findOne({ where: { id } });
  }
  
  /** Create Note の JSON を組み立てる */
  private renderCreateNote(post: Post): any {
    const fqdn = this.hostUrlService.fqdn;
    const published = post.createdAt.toISOString().slice(0, 19) + 'Z';  // ISO 形式の投稿日時 `YYYY-MM-DDTHH:mm:SSZ`
    const json = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type      : 'Create',
      id        : `${fqdn}/api/activity-pub/users/${post.userName}/notes/${post.id}`,
      actor     : `${fqdn}/api/activity-pub/users/${post.userName}`,
      published : published,
      object    : {
        type        : 'Note',
        id          : `${fqdn}/api/activity-pub/users/${post.userName}/notes/${post.id}`,  // Fediverse で一意
        attributedTo: `${fqdn}/api/activity-pub/users/${post.userName}`,                   // 投稿者の `Person#id`・このエンドポイントにアクセスできないと投稿が認識されない
        content     : post.text,                                                           // XHTML で記述された投稿内容
        published   : published,
        to: [                                                                              // 公開範囲
          'https://www.w3.org/ns/activitystreams#Public',                                  // 公開
          `${fqdn}/api/activity-pub/users/${post.userName}/followers`,                     // フォロワー
        ]
      }
    };
    return json;
  }
}
