import { Column, Entity, PrimaryColumn } from 'typeorm';

/** ユーザアカウント */
@Entity('users')
export class User {
  /** ユーザ名 (半角英小文字・数字・ハイフンのみ許容する) */
  @PrimaryColumn({ type: 'text', name: 'name' })
  public name: string;
  
  /** パスワード (ハッシュ化した文字列を入れる) */
  @Column({ type: 'text', name: 'password' })
  public password: string;
}
