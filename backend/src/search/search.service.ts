import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { HostUrlService } from 'src/shared/services/host-url.service';
import { UsersService } from 'src/users/users.service';

const activityJsonHeaderOption = {
  headers: {
    Accept        : 'application/activity+json',
    'Content-Type': 'application/activity+json'
  }
};

@Injectable()
export class SearchService {
  constructor(
    private httpService: HttpService,
    private hostUrlService: HostUrlService,
    private usersService: UsersService,
  ) { }
  
  public search(query: string): Promise<any | null> {
    if((/^https?:\/\//).test(query)) return this.searchUrl(query);
    if((/^@.+@.+$/    ).test(query)) return this.searchRemoteUser(query);
    if((/^@.+$/       ).test(query)) return this.searchLocalUser(query);
    return null;
  }
  
  private async searchUrl(query: string): Promise<any | null> {
    const result = await firstValueFrom(this.httpService.get(query, activityJsonHeaderOption)).catch(_error => null);
    if(result == null) return null;
    // 投稿だった場合
    if(result?.data?.type === 'Note') {
      const personUrl = result.data.attributedTo;
      if(personUrl == null) return null;
      const personResult = await firstValueFrom(this.httpService.get(personUrl, activityJsonHeaderOption)).catch(_error => null);
      const userName = personResult?.data?.preferredUsername;
      if(userName == null) return null;
      return {
        type     : 'Post',
        postId   : result.data.id,
        postUrl  : result.data.url,
        createdAt: result.data.published,
        content  : result.data.content,
        userId   : personResult.data.id,
        userUrl  : personResult.data.url,
        userName : userName,
        userHost : this.getRemoteHost(personResult.data.id)
      };
    }
    // ユーザだった場合
    if(result?.data?.type === 'Person') return {
      type    : 'User',
      userId  : result.data.id,
      userUrl : result.data.url,
      userName: result.data.preferredUsername,
      userHost: this.getRemoteHost(result.data.id)
    };
    // それ以外の結果は `null` とする
    return null;
  }
  
  private async searchRemoteUser(query: string): Promise<any | null> {
    const matches  = query.match((/^@(.+)@(.+)$/));
    const userName = matches?.[1];
    const host     = matches?.[2];
    if(userName == null || host == null) return null;
    if(host === this.hostUrlService.host) return this.searchLocalUser(userName);
    
    const url = `https://${host}/@${userName}`;  // Mastodon はこの URL でユーザが取れるのでコレにする
    const result = await firstValueFrom(this.httpService.get(url, activityJsonHeaderOption)).catch(_error => null);
    if(result == null || result?.data?.type !== 'Person') return null;
    return {
      type    : 'User',
      userId  : result.data.id,
      userUrl : result.data.url,
      userName: result.data.preferredUsername,
      userHost: this.getRemoteHost(result.data.id)
    };
  }
  
  private async searchLocalUser(query: string): Promise<any | null> {
    query = query.replace((/^@/), '');
    const user = await this.usersService.findOne(query);
    if(user == null) return null;
    return {
      type    : 'User',
      userId  : `${this.hostUrlService.fqdn}/api/activity-pub/users/${user.name}`,
      userUrl : `${this.hostUrlService.fqdn}/users/${user.name}`,
      userName: user.name,
      userHost: null
    };
  }
  
  // ローカルホストの場合は `null` を返す
  private getRemoteHost(url: string): string | null {
    const host = new URL(url).host;
    return host === this.hostUrlService.host ? null : host;
  }
}
