/** ユーザ */
export class User {
  /** ユーザ名 */
  public name!: string;
  
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
