import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { FollowersService } from '../followers/followers.service';

import { Post } from 'src/entities/post';

@Injectable()
export class PostsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private followersService: FollowersService,
  ) { }
  
  /**
   * 投稿を登録する
   * 
   * @return 登録できた投稿情報
   * @throws バリデーションエラー時、登録失敗時
   */
  public async create(userName: string, text: string): Promise<Post> {
    if(text == null || text === '') throw new Error('Invalid Text');  // 空値は弾く
    const post = new Post({ userName, text });
    const insertResult = await this.postsRepository.insert(post);  // Throws
    const createdId = insertResult.identifiers?.[0]?.id;
    if(createdId == null) throw new Error('Failed To Insert Post');
    return this.findOne(createdId);
  }
  
  /** フォロワーを取得し、そのフォロワーの Inbox に Create を投げる … TODO : BullMQ でやりたい */
  public async publishNote(post: Post): Promise<void> {
    const followers = await this.followersService.findAll(post.userName);
    for(const follower of followers) {
      await firstValueFrom(this.httpService.post(follower.inboxUrl)).catch(_error => null);  // TODO : Create イベント
    }
  }
  
  private findOne(id: number): Promise<Post> {
    return this.postsRepository.findOne({ where: { id } });
  }
}
