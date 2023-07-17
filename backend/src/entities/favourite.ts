import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

/** ふぁぼ */
@Entity('favourites')
export class Favourite {
  /** ユーザ名 */
  @PrimaryColumn({ type: 'text', name: 'user_name' })
  public userName: string;
  /** ふぁぼった投稿の URL */
  @PrimaryColumn({ type: 'text', name: 'post_url' })
  public postUrl: string;
  /** ふぁぼったユーザの Inbox URL */
  @Column({ type: 'text', name: 'inbox_url' })
  public inboxUrl: string;
  /** 登録日時 */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  constructor(partial: Partial<Favourite>) { Object.assign(this, partial); }
}
