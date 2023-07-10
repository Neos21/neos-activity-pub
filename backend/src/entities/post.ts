import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** 投稿 */
@Entity('posts')
export class Post {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number;
  
  /** ユーザ名 */
  @Column({ type: 'text', name: 'user_name' })
  public userName: string;
  
  /** 本文 */
  @Column({ type: 'text', name: 'text' })
  public text: string;
  
  /** 登録日時 */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}
