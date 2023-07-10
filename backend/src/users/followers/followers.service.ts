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
  
  /** フォロワー情報を追加する */
  public create(userName: string, actorObject: any): Promise<boolean> {
    const follower = new Follower({
      userName    : userName,
      followerName: this.actorObjectSerice.getFullName(actorObject),
      actorUrl    : actorObject.id,
      inboxUrl    : actorObject.inbox
    })
    return this.followersRepository.insert(follower).then(_insertResult => true).catch(_error => false);
  }
  
  /** フォロワーを新しいモノから順番に一覧で返す */
  public findAll(userName: string): Promise<Array<Follower>> {
    return this.followersRepository.find({
      where: { userName },
      order: { createdAt: 'DESC' }
    });
  }
  
  /** フォロワー情報を削除する */
  public remove(userName: string, actorObject: any): Promise<boolean> {
    return this.followersRepository.delete({
      userName    : userName,
      followerName: this.actorObjectSerice.getFullName(actorObject)
    }).then(_deleteResult => true).catch(_error => false);
  }
}
