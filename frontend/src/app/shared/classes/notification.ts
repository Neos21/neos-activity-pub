/** 通知 */
export class Notification {
  /** ユーザ名 */
  public userName!: string;
  /** 通知タイプ : `follow`・`like` */
  public type!: string;
  /** Actor 名 */
  public actorName!: string;
  /** リモートホスト (リモートユーザの場合のみ・ローカルユーザの場合は `null`) */
  public remoteHost?: string;
  /** 対象の投稿 ID (投稿へのいいねの場合のみ) */
  public postId?: number;
  /** 登録日時 */
  public createdAt!: string;
  
  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
  }
}
