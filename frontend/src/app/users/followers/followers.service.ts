import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Follower } from 'src/app/shared/classes/follower';

@Injectable({ providedIn: 'root' })
export class FollowersService {
  constructor(private httpClient: HttpClient) { }
  
  /** フォロワー一覧を取得する */
  public async findAll(userName: string): Promise<Array<Follower> | null> {
    const followers = await firstValueFrom(this.httpClient.get<Array<Follower>>(`/api/users/${userName}/followers`)).catch(_error => null);
    if(followers == null) return null;
    followers.forEach(follower => follower.createdAt = follower.createdAt.slice(0, 19).replace('T', ' '));  // `YYYY-MM-DD HH:mm:SS` にする
    return followers;
  }
}
