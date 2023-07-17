import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { Following } from 'src/entities/following';
import { HostUrlService } from 'src/shared/services/host-url.service';
import { SignHeaderService } from 'src/activity-pub/sign-header.service';
import { UsersService } from '../users.service';

const headers = {
  headers: {
    Accept        : 'application/activity+json',
    'Content-Type': 'application/activity+json'
  }
};

@Injectable()
export class FollowingsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Following) private followingsRepository: Repository<Following>,
    private hostUrlService: HostUrlService,
    private signHeaderService: SignHeaderService,
    private usersService: UsersService,
  ) { }
  
  /** フォロー通知を相手の Inbox URL に投げる */
  public postFollowInboxToLocalUser(userName: string, followingName: string): Promise<any> {
    return firstValueFrom(this.httpService.post(`${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}/inbox`, {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id        : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
      type      : 'Follow',
      actor     : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
      object    : `${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}`
    }, headers));  // Throws
  }
  
  /** WebFinger を辿って Actor Object URL と Inbox URL を取得する */
  public async fetchActor(followingName: string, followingRemoteHost: string): Promise<{ objectUrl: string; inboxUrl: string; }> {
    const webFingerResponse = await firstValueFrom(this.httpService.get(`https://${followingRemoteHost}/.well-known/webfinger?resource=acct:${followingName}@${followingRemoteHost}`, headers));  // Throws
    const webFinger = webFingerResponse.data;
    const objectUrl = webFinger?.links?.find(item => item.rel === 'self')?.href;
    const actorResponse = await firstValueFrom(this.httpService.get(objectUrl, headers));  // Throws
    const actor = actorResponse.data;
    const inboxUrl = actor.inbox;
    return { objectUrl, inboxUrl };
  }
  
  /** フォロー通知を相手の Inbox URL に投げる */
  public async postFollowInboxToRemoteUser(userName: string, inboxUrl: string, objectUrl: string): Promise<any> {
    const user = await this.usersService.findOneWithPrivateKey(userName);
    const json = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id        : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
      type      : 'Follow',
      actor     : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
      object    : objectUrl
    };
    const requestHeaders = this.signHeaderService.signHeader(json, inboxUrl, userName, user.privateKey);
    return firstValueFrom(this.httpService.post(inboxUrl, JSON.stringify(json), { headers: requestHeaders }));  // Throws
  }
  
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
  
  /** リモートユーザをフォローユーザとして登録する */
  public createRemoteUser(userName: string, followingName: string, followingRemoteHost: string, objectUrl: string, inboxUrl: string): Promise<InsertResult> {
    const following = new Following({
      userName,
      followingName,
      followingRemoteHost,
      url     : objectUrl,
      actorUrl: objectUrl,
      inboxUrl
    });
    return this.followingsRepository.insert(following);  // Throws
  }
  
  /** フォロー中を新しいモノから順番に一覧で返す */
  public findAll(userName: string): Promise<Array<Following>> {
    return this.followingsRepository.find({
      where: { userName },
      order: { createdAt: 'DESC' }
    });
  }
  
  /** ローカルユーザをフォロー中かどうか調べる・`null` が返れば未フォロー */
  public searchLocalUser(userName: string, followingName: string): Promise<Following | null> {
    return this.followingsRepository.findOne({
      where: { userName, followingName, followingRemoteHost: '' }
    });
  }
  
  /** リモートユーザをフォロー中かどうか調べる・`null` が返れば未フォロー */
  public searchRemoteUser(userName: string, followingName: string, followingRemoteHost: string): Promise<Following | null> {
    return this.followingsRepository.findOne({
      where: { userName, followingName, followingRemoteHost }
    });
  }
  
  public postUnfollowInboxToLocalUser(userName: string, followingName: string): Promise<any> {
    return firstValueFrom(this.httpService.post(`${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}/inbox`, {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id        : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
      type      : 'Undo',
      actor     : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
      object    : {
        id      : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
        type    : 'Follow',
        actor   : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
        object  : `${this.hostUrlService.fqdn}/api/activity-pub/users/${followingName}`
      }
    }, headers));
  }
  
  public postUnfollowInboxToRemoteUser(userName: string, followingName: string, objectUrl: string, inboxUrl: string): Promise<any> {
    return firstValueFrom(this.httpService.post(inboxUrl, {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id        : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
      type      : 'Undo',
      actor     : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
      object    : {
        id      : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
        type    : 'Follow',
        actor   : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
        object  : objectUrl
      }
    }, headers));
  }
  
  /** ローカルユーザをアンフォローするため削除する */
  public removeLocalUser(userName: string, followingName: string): Promise<DeleteResult> {
    return this.followingsRepository.delete({ userName, followingName, followingRemoteHost: '' });
  }
  
  /** リモートユーザをアンフォローするため削除する */
  public removeRemoteUser(userName: string, followingName: string, followingRemoteHost: string): Promise<DeleteResult> {
    return this.followingsRepository.delete({ userName, followingName, followingRemoteHost });
  }
}
