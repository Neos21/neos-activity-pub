/** ユーザ */
export class User {
  /** ユーザ名 */
  public name!: string;
  /** 登録日 */
  public createdAt!: string;
  
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
