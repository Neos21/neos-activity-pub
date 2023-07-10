/** 投稿 */
export class Post {
  /** ID */
  public id!: number;
  /** ユーザ名 */
  public userName!: string;
  /** 本文 */
  public text!: string;
  /** 登録日時 */
  public createdAt!: string;
  
  constructor(partial: Partial<Post>) { Object.assign(this, partial); }
}
