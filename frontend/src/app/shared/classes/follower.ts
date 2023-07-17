/** フォロワー */
export class Follower {
  /** ユーザ名 */
  public userName!: string;
  /** フォロワー名 */
  public followerName!: string;
  /** フォロワーのリモートホスト (ローカルユーザは `null` ではなく空文字) */
  public followerRemoteHost?: string;
  /** フォロワーのプロフィールページ URL */
  public url!: string;
  /** フォロワーの Actor URL */
  public actorUrl!: string;
  /** フォロワーの Inbox URL */
  public inboxUrl!: string;
  /** 登録日時 */
  public createdAt!: string;
  
  constructor(partial: Partial<Follower>) { Object.assign(this, partial); }
}
