import { Injectable } from '@nestjs/common';

import { HostUrlService } from './host-url.service';

@Injectable()
export class ActorObjectService  {
  constructor(private hostUrlService: HostUrlService) { }
  
  /**
   * Actor オブジェクトからホスト名 (`example.com` 部分) を取得する
   * ローカルのホスト名と同じだった場合は `undefined` を返す
   * 
   * @param actorObject Actor オブジェクト
   * @return リモートホスト名・ローカルのホストだった場合は `undefined`
   */
  public getRemoteHost(actorObject: any): string | undefined {
    const targetHost = new URL(actorObject.url).host;
    if(this.hostUrlService.host === targetHost) return undefined;
    return targetHost;
  }
  
  /**
   * Actor オブジェクトからユーザ名を取得する
   * 
   * @param actorObject Actor オブジェクト
   * @return ユーザ名
   */
  public getActorUserName(actorObject: any): string {
    return actorObject.preferredUsername;
  }
  
  /**
   * Actor オブジェクトからユーザのフルネームを取得する
   * 
   * @param actorObject Actor オブジェクト
   * @return ローカルユーザの場合はユーザ名のみ、リモートユーザの場合は `USER_NAME@HOST_NAME` とする
   */
  public getFullName(actorObject: any): string {
    const remoteHost    = this.getRemoteHost(actorObject);
    const actorUserName = this.getActorUserName(actorObject);
    if(remoteHost == null) return actorUserName;
    return `${actorUserName}@${remoteHost}`;
  }
}
