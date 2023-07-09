import { Column, Entity, PrimaryColumn } from 'typeorm';

/** ユーザ */
@Entity('users')
export class User {
  /** ユーザ名 (半角英小文字・数字・ハイフンのみ許容する・20文字まで) */
  @PrimaryColumn({ type: 'text', name: 'name' })
  public name: string;
  
  /** パスワード (ハッシュ化した文字列) */
  @Column({ type: 'text', name: 'password' })
  public password: string;
  
  /** 公開鍵 */
  @Column({ type: 'text', name: 'public_key' })
  public publicKey: string;
  
  /** 秘密鍵 */
  @Column({ type: 'text', name: 'private_key' })
  public privateKey: string;
  
  /** 登録日 (YYYY-MM-DD) */
  @Column({ type: 'text', name: 'created_at' })
  public createdAt: string;
}
