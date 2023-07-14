import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Following } from 'src/app/shared/classes/following';

@Injectable({ providedIn: 'root' })
export class FollowingsService {
  constructor(private httpClient: HttpClient) { }
  
  /** フォロー中一覧を取得する */
  public async findAll(userName: string): Promise<Array<Following> | null> {
    const followings = await firstValueFrom(this.httpClient.get<Array<Following>>(`/api/users/${userName}/followings`)).catch(_error => null);
    if(followings == null) return null;
    followings.forEach(following => following.createdAt = following.createdAt.slice(0, 19).replace('T', ' '));  // `YYYY-MM-DD HH:mm:SS` にする
    return followings;
  }
}
