import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { Following } from 'src/entities/following';
import { HostUrlService } from 'src/shared/services/host-url.service';

@Injectable()
export class FollowingsService {
  constructor(
    @InjectRepository(Following) private followingsRepository: Repository<Following>,
    private hostUrlService: HostUrlService,
  ) { }
  
  /**
   * ローカルユーザをフォローユーザとして登録する
   * 
   * @throws 登録失敗時
   */
  public createLocalUser(userName: string, followingName: string): Promise<InsertResult> {
    const following = new Following({
      userName,
      followingName,
      followingRemoteHost: '',
      url     : `${this.hostUrlService.fqdn}/users/${followingName}`,
      actorUrl: `${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}`,
      inboxUrl: `${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}/inbox`
    });
    return this.followingsRepository.insert(following);  // Throws
  }
  
  public createRemoteUser(userName: string, followingName: string, followingRemoteHost: string): void {
    // TODO : fullName に `acct:` を付けて WebFinger を拾う
    // TODO : links[].rel:self の href にアクセスして actorURL・inboxURL を拾う
  }
  
  /** フォロー中を新しいモノから順番に一覧で返す */
  public findAll(userName: string): Promise<Array<Following>> {
    return this.followingsRepository.find({
      where: { userName },
      order: { createdAt: 'DESC' }
    });
  }
  
  /** ローカルユーザをフォロー中かどうか調べる・`null` が返れば未フォロー */
  public searchLocalUser(userName: string, followingName: string) {
    return this.followingsRepository.findOne({
      where: { userName, followingName, followingRemoteHost: '' }
    });
  }
  
  /** ローカルユーザをアンフォローするため削除する */
  public removeLocalUser(userName: string, followingName: string): Promise<DeleteResult> {
    return this.followingsRepository.delete({ userName, followingName, followingRemoteHost: '' });
  }
}
