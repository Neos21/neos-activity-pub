import { Injectable } from '@nestjs/common';

import { HostUrlService } from './host-url.service';

@Injectable()
export class ActorObjectService  {
  constructor(private hostUrlService: HostUrlService) { }
  
  /** Actor オブジェクトからホスト名 (`example.com` 部分) を取得する・ローカルのホスト名と同じだった場合は `undefined` を返す */
  public getRemoteHost(actorObject: any): string | undefined {
    const targetHost = new URL(actorObject.url).host;
    if(this.hostUrlService.host === targetHost) return undefined;
    return targetHost;
  }
  
  /** Actor オブジェクトからユーザ名を取得する */
  public getActorUserName(actorObject: any): string {
    return actorObject.preferredUsername;
  }
  
  /** Actor オブジェクトからフルネーム (ローカルユーザは `USER`・リモートユーザは `USER@HOST`) を取得する */
  public getFullName(actorObject: any): string {
    const remoteHost    = this.getRemoteHost(actorObject);
    const actorUserName = this.getActorUserName(actorObject);
    if(remoteHost == null) return actorUserName;
    return `${actorUserName}@${remoteHost}`;
  }
}
