import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActorObjectService } from 'src/shared/services/actor-object.service';

import { Follower } from 'src/entities/follower';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follower) private followersRepository: Repository<Follower>,
    private actorObjectSerice: ActorObjectService
  ) { }
  
  /** フォロワー情報を追加する : Inbox より呼び出される */
  public create(userName: string, actorObject: any): Promise<boolean> {
    const follower = new Follower({
      userName          : userName,
      followerName      : actorObject.preferredUsername,
      followerRemoteHost: this.actorObjectSerice.getRemoteHost(actorObject.id) ?? '',
      url               : actorObject.url,
      actorUrl          : actorObject.id,
      inboxUrl          : actorObject.inbox
    });
    console.log('TODO : ', follower);
    return this.followersRepository.insert(follower).then(_insertResult => true).catch(_error => {
      console.log('TODO: : 何が悪い', _error);
      return false});
  }
  
  /** フォロワーを新しいモノから順番に一覧で返す */
  public findAll(userName: string): Promise<Array<Follower>> {
    return this.followersRepository.find({
      where: { userName },
      order: { createdAt: 'DESC' }
    });
  }
  
  /** フォロワー情報を削除する : Inbox より呼び出される */
  public remove(userName: string, actorObject: any): Promise<boolean> {
    return this.followersRepository.delete({
      userName          : userName,
      followerName      : actorObject.preferredUsername,
      followerRemoteHost: this.actorObjectSerice.getRemoteHost(actorObject.id) ?? ''
    }).then(_deleteResult => true).catch(_error => false);
  }
}
