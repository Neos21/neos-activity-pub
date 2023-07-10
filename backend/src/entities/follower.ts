import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

/** フォロワー */
@Entity('followers')
export class Follower {
  /** ユーザ名 */
  @PrimaryColumn({ type: 'text', name: 'user_name' })
  public userName: string;
  /** フォロワー名 */
  @PrimaryColumn({ type: 'text', name: 'follower_name' })
  public followerName: string;
  /** フォロワーの Actor URL */
  @Column({ type: 'text', name: 'actor_url' })
  public actorUrl: string;
  /** フォロワーの Inbox URL */
  @Column({ type: 'text', name: 'inbox_url' })
  public inboxUrl: string;
  /** 登録日時 */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  constructor(partial: Partial<Follower>) { Object.assign(this, partial); }
}
