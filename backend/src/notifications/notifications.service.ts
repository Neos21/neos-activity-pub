import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActorObjectService } from 'src/shared/services/actor-object.service';

import { Notification } from 'src/entities/notification';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
    private actorObjectSerice: ActorObjectService
  ) { }
  
  /** フォローされた通知を作成する */
  public createFollow(userName: string, actorObject: any): Promise<boolean> {
    const notification = new Notification({
      userName  : userName,
      type      : 'follow',
      actorName : actorObject.preferredUsername,
      remoteHost: this.actorObjectSerice.getRemoteHost(actorObject?.url)
    });
    return this.notificationsRepository.insert(notification).then(_insertResult => true).catch(_error => false);
  }
  
  public createLike(userName: string, actorObject: any, postId: string): Promise<boolean> {
    const notification = new Notification({
      userName  : userName,
      type      : 'like',
      actorName : actorObject.preferredUsername,
      remoteHost: this.actorObjectSerice.getRemoteHost(actorObject?.url),
      postId    : postId
    });
    return this.notificationsRepository.insert(notification).then(_insertResult => true).catch(_error => false);
  }
  
  /** 通知を新しいモノから順番に一覧で返す */
  public findAll(userName: string): Promise<Array<Notification>> {
    return this.notificationsRepository.find({
      where: { userName },
      order: { createdAt: 'DESC' }
    });
  }
}
