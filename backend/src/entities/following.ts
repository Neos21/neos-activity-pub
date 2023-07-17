import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

/** フォロー中ユーザ */
@Entity('followings')
export class Following {
  /** ユーザ名 */
  @PrimaryColumn({ type: 'text', name: 'user_name' })
  public userName: string;
  /** フォローしたユーザ名 */
  @PrimaryColumn({ type: 'text', name: 'following_name' })
  public followingName: string;
  /** フォローしたユーザのリモートホスト (ローカルユーザは `null` ではなく空文字を入れる・検索条件にうまくヒットしなくなってしまうため) */
  @PrimaryColumn({ type: 'text', name: 'following_remote_host' })
  public followingRemoteHost: string;
  /** フォローしたユーザのプロフィールページ URL */
  @Column({ type: 'text', name: 'url' })
  public url: string;
  /** フォローしたユーザの Actor URL */
  @Column({ type: 'text', name: 'actor_url' })
  public actorUrl: string;
  /** フォローしたユーザの Inbox URL */
  @Column({ type: 'text', name: 'inbox_url' })
  public inboxUrl: string;
  /** 登録日時 */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  constructor(partial: Partial<Following>) { Object.assign(this, partial); }
}
