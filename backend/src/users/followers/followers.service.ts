import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Follower } from 'src/entities/follower';
import { ActorObjectService } from 'src/shared/services/actor-object.service';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follower) private followersRepository: Repository<Follower>,
    private actorObjectSerice: ActorObjectService
  ) { }
  
  /**
   * フォロワー情報を追加する
   * 
   * @param userName User Name
   * @param actorObject Actor Object
   * @return 成功なら `true`・失敗なら `false`
   */
  public async create(userName: string, actorObject: any): Promise<boolean> {
    try {
      const follower = new Follower({
        userName    : userName,
        followerName: this.actorObjectSerice.getFullName(actorObject),
        actorUrl    : actorObject.id,
        inboxUrl    : actorObject.inbox
      })
      await this.followersRepository.insert(follower);  // Throws
      return true;
    }
    catch(_error) {
      return false;
    }
  }
  
  /**
   * フォロワーを新しいモノから順番に一覧で返す
   * 
   * @param userName User Name
   * @return フォロワー一覧
   */
  public async findAll(userName: string): Promise<Array<Follower>> {
    return await this.followersRepository.find({
      where: { userName },
      order: { createdAt: 'DESC' }
    });
  }
  
  /**
   * フォロワー情報を削除する
   * 
   * @param userName User Name
   * @param actorObject Actor Object
   * @return 成功なら `true`・失敗なら `false`
   */
  public async remove(userName: string, actorObject: any): Promise<boolean> {
    try {
      await this.followersRepository.delete({
        userName    : userName,
        followerName: this.actorObjectSerice.getFullName(actorObject)
      });
      return true;
    }
    catch(_error) {
      return false;
    }
  }
}
