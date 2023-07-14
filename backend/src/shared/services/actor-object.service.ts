import { Injectable } from '@nestjs/common';

import { HostUrlService } from './host-url.service';

@Injectable()
export class ActorObjectService  {
  constructor(private hostUrlService: HostUrlService) { }
  
  /** URL からホスト名 (`example.com` 部分) を取得する・ローカルのホスト名と同じだった場合は `null` を返す */
  public getRemoteHost(url: string): string | null {
    const host = new URL(url).host;
    return host === this.hostUrlService.host ? null : host;
  }
  
  /** Actor オブジェクトからフルネーム (ローカルユーザは `USER`・リモートユーザは `USER@HOST`) を取得する */
  public getFullName(actorObject: any): string {
    const remoteHost    = this.getRemoteHost(actorObject.host);
    const actorUserName = actorObject.preferredUsername;
    if(remoteHost == null) return actorUserName;
    return `${actorUserName}@${remoteHost}`;
  }
}
