/** フォロワー */
export class Follower {
  /** ユーザ名 */
  public userName!: string;
  /** フォロワー名 */
  public followerName!: string;
  /** 登録日時 */
  public createdAt!: string;
  
  constructor(partial: Partial<Follower>) {
    Object.assign(this, partial);
  }
}
