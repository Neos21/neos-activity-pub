import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowingsService {
  /**
   * 
   * @param userName フォローする側のユーザ名 (ローカルユーザなので名前のみ)
   * @param fullName フォロー対象のユーザ名 (必ず `USER@HOST` の形式で送ってもらう)
   */
  public create(userName: string, fullName: string): void {
    
    // TODO : fullName に `acct:` を付けて WebFinger を拾う
    // TODO : links[].rel:self の href にアクセスして actorURL・inboxURL を拾う
  }
}
