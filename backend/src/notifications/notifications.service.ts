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
  public async createFollow(userName: string, actorObject: any): Promise<boolean> {
    try {
      const notification = new Notification({
        userName  : userName,
        type      : 'follow',
        actorName : this.actorObjectSerice.getActorUserName(actorObject),
        remoteHost: this.actorObjectSerice.getRemoteHost(actorObject)
      });
      await this.notificationsRepository.insert(notification);  // Throws
      return true;
    }
    catch(_error) {
      return false;
    }
  }
  
  /** 通知を新しいモノから順番に一覧で返す */
  public async findAll(userName: string): Promise<Array<Notification>> {
    return await this.notificationsRepository.find({
      where: { userName },
      order: { createdAt: 'DESC' }
    });
  }
}
