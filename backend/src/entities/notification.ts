import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** 通知 */
@Entity('notifications')
export class Notification {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number;
  /** ユーザ名 (通知先・ログインユーザ) */
  @Column({ type: 'text', name: 'user_name' })
  public userName: string;
  /** 通知タイプ : `follow`・`like`・`boost`・`reply` */
  @Column({ type: 'text', name: 'type' })
  public type: string;
  /** Actor 名 (通知元) */
  @Column({ type: 'text', name: 'actor_name' })
  public actorName: string;
  /** Actor のリモートホスト (リモートユーザの場合のみ・ローカルユーザの場合は `null`) */
  @Column({ type: 'text', name: 'remote_host', nullable: true })
  public remoteHost: string;
  
  /** 対象の投稿 ID (URL・投稿へのいいね・ブースト・リプライの場合のみ) */
  @Column({ type: 'text', name: 'post_id', nullable: true })
  public postId: string;
  
  /** リプライ時の ID (`object.id`) */
  @Column({ type: 'text', name: 'reply_id', nullable: true })
  public replyId: string;
  /** リプライ時の URL (`object.url`) */
  @Column({ type: 'text', name: 'reply_url', nullable: true })
  public replyUrl: string;
  /** リプライ時のコンテンツ (`object.content`) */
  @Column({ type: 'text', name: 'reply_content', nullable: true })
  public replyContent: string;
  
  
  /** 登録日時 */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  constructor(partial: Partial<Notification>) { Object.assign(this, partial); }
}
