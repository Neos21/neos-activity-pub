import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from 'src/entities/notification';
import { ActorObjectService } from 'src/shared/services/actor-object.service';

@Injectable()
export class NotificationsService {
  private logger: Logger = new Logger(NotificationsService.name);
  
  constructor(
    @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
    private actorObjectSerice: ActorObjectService
  ) { }
  
  /**
   * フォローされた通知を作成する
   * 
   * @param userName User Name
   * @param actorObject Actor Object
   * @return 成功すれば `true`・失敗すれば `false`
   */
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
    catch(error) {
      this.logger.error('Failed To Create Follow', error);
      return false;
    }
  }
  
  /**
   * 通知を新しいモノから順番に一覧で返す
   * 
   * @param userName User Name
   * @return 通知一覧
   */
  public async findAll(userName: string): Promise<Array<Notification>> {
    return await this.notificationsRepository.find({
      where: { userName },
      order: { createdAt: 'DESC' }
    });
  }
}
