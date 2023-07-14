/** フォロー中ユーザ */
export class Following {
  /** ユーザ名 */
  public userName!: string;
  /** フォローしたユーザ名 */
  public followingName!: string;
  /** フォローしたユーザのリモートホスト (ローカルユーザは `null` ではなく空文字) */
  public followingRemoteHost?: string;
  /** フォローしたユーザのプロフィールページ URL */
  public url!: string;
  /** フォローしたユーザの Actor URL */
  public actorUrl!: string;
  /** フォローしたユーザの Inbox URL */
  public inboxUrl!: string;
  /** 登録日時 */
  public createdAt!: string;
  
  constructor(partial: Partial<Following>) { Object.assign(this, partial); }
}
