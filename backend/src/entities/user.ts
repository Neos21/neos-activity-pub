import { Column, Entity, PrimaryColumn } from 'typeorm';

/** ユーザアカウント */
@Entity('users')
export class User {
  /** ID */
  @PrimaryColumn({ type: 'text', name: 'id' })
  public id: string;
  
  /** メールアドレス (ログインに使用する) */
  @Column({ type: 'text', name: 'email' })
  public eMail: string;
  
  /** パスワード (ハッシュ化した文字列を入れる) */
  @Column({ type: 'text', name: 'password' })
  public password: string;
  
  /** ユーザ名 (半角英小文字・数字・ハイフンのみ許容する) */
  @Column({ type: 'text', name: 'name' })
  public name: string;
  
  /** 表示名 */
  @Column({ type: 'text', name: 'display_name' })
  public displayName: string;
}
