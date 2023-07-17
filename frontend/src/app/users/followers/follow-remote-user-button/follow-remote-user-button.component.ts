import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

/** リモートユーザをフォロー・アンフォローするためのボタン */
@Component({
  selector: 'app-follow-remote-user-button',
  templateUrl: './follow-remote-user-button.component.html',
  styleUrls: ['./follow-remote-user-button.component.css']
})
export class FollowRemoteUserButtonComponent implements OnInit {
  /** フォローする側のユーザ名 */
  @Input()
  public userName?: string;
  /** フォロー対象のユーザ名 */
  @Input()
  public followingName?: string;
  /** フォロー対象ユーザのリモートホスト名 */
  @Input()
  public followingRemoteHost?: string;
  
  /** ボタンのラベル */
  public label: string = 'フォローする…';
  /** ボタンを比活性にするかどうか */
  public isDisabled: boolean = true;
  /** 既にフォロー中なら `true`・コレからフォローするなら `false` */
  public isFollowing: boolean = false;
  
  constructor(private httpClient: HttpClient) { }
  
  public async ngOnInit(): Promise<void> {
    try {
      const result = await firstValueFrom(this.httpClient.get<{ result: any; }>(`/api/users/${this.userName}/followings/search?userName=${this.userName}&followingName=${this.followingName}&followingRemoteHost=${this.followingRemoteHost}`));  // Throws
      if(result?.result == null) {  // 未フォロー
        this.isFollowing = false;
        this.label = `@${this.followingName}@${this.followingRemoteHost} をフォローする`;
      }
      else {
        this.isFollowing = true;
        this.label = `@${this.followingName}@${this.followingRemoteHost} をアンフォローする`;
      }
      this.isDisabled = false;
      
    }
    catch(error) {
      console.error('FollowRemoteUserComponent#ngOnInit() : Error', error);
      this.isDisabled  = true;
      this.isFollowing = false;
      this.label = `@${this.followingName}@${this.followingRemoteHost} をフォローする`;
    }
  }
  
  public async onFollow(): Promise<void> {
    this.isDisabled = true;
    if(this.isFollowing) {  // アンフォローする
      try {
        await firstValueFrom(this.httpClient.delete(`/api/users/${this.userName}/followings`, { body: {
          userName           : this.userName,
          followingName      : this.followingName,
          followingRemoteHost: this.followingRemoteHost
        } }));
        this.isFollowing = false;
        this.label = `@${this.followingName}@${this.followingRemoteHost} をフォローする`;
      }
      catch(error) {
        console.error('FollowRemoteUserComponent#onFollow() : Failed To Unfollow', error);
      }
    }
    else {  // フォローする
      try {
        await firstValueFrom(this.httpClient.post(`/api/users/${this.userName}/followings`, {
          userName           : this.userName,
          followingName      : this.followingName,
          followingRemoteHost: this.followingRemoteHost
        }));
        this.isFollowing = true;
        this.label = `@${this.followingName}@${this.followingRemoteHost} をアンフォローする`;
      }
      catch(error) {
        console.error('FollowRemoteUserComponent#onFollow() : Failed To Follow', error);
      }
    }
    this.isDisabled = false;
  }
}
