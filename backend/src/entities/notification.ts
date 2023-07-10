import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

/** 通知 */
@Entity('notifications')
export class Notification {
  /** ユーザ名 */
  @PrimaryColumn({ type: 'text', name: 'user_name' })
  public userName: string;
  
  /** 通知タイプ : `follow`・`like` */
  @Column({ type: 'text', name: 'type' })
  public type: string;
  
  /** Actor 名 */
  @Column({ type: 'text', name: 'actor_name' })
  public actorName: string;
  
  /** リモートホスト (リモートユーザの場合のみ・ローカルユーザの場合は `null`) */
  @Column({ type: 'text', name: 'remote_host', nullable: true })
  public remoteHost: string;
  
  /** 対象の投稿 ID (投稿へのいいねの場合のみ) */
  @Column({ type: 'text', name: 'post_id', nullable: true })
  public postId: number;
  
  /** 登録日時 */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
  }
}
