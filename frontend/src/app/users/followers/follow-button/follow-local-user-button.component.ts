import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';

/** ローカルユーザをフォロー・アンフォローするためのボタン */
@Component({
  selector: 'app-follow-local-user-button',
  templateUrl: './follow-local-user-button.component.html',
  styleUrls: ['./follow-local-user-button.component.css']
})
export class FollowLocalUserButtonComponent implements OnInit {
  /** フォローする側のユーザ名 */
  @Input()
  public userName?: string;
  /** フォロー対象のユーザ名 */
  @Input()
  public followingName?: string;
  
  /** ボタンのラベル */
  public label: string = 'フォローする…';
  /** ボタンを比活性にするかどうか */
  public isDisabled: boolean = true;
  /** 既にフォロー中なら `true`・コレからフォローするなら `false` */
  public isFollowing: boolean = false;
  
  constructor(private httpClient: HttpClient) { }
  
  public async ngOnInit(): Promise<void> {
    try {
      const result = await firstValueFrom(this.httpClient.get<{ result: any; }>(`/api/users/${this.userName}/followings/search?userName=${this.userName}&followingName=${this.followingName}`));  // Throws
      if(result?.result == null) {  // 未フォロー
        this.isFollowing = false;
        this.label = `@${this.followingName} をフォローする`;
      }
      else {
        this.isFollowing = true;
        this.label = `@${this.followingName} をアンフォローする`;
      }
      this.isDisabled = false;
      
    }
    catch(error) {
      console.error('FollowLocalUserComponent#ngOnInit() : Error', error);
      this.isDisabled  = true;
      this.isFollowing = false;
      this.label = `@${this.followingName} をフォローする`;
    }
  }
  
  public async onFollow(): Promise<void> {
    this.isDisabled = true;
    if(this.isFollowing) {  // アンフォローする
      try {
        await firstValueFrom(this.httpClient.delete(`/api/users/${this.userName}/followings`, { body: {
          userName     : this.userName,
          followingName: this.followingName
        } }));
        this.isFollowing = false;
        this.label = `@${this.followingName} をフォローする`;
      }
      catch(error) {
        console.error('FollowLocalUserComponent#onFollow() : Failed To Unfollow', error);
      }
    }
    else {  // フォローする
      try {
        await firstValueFrom(this.httpClient.post(`/api/users/${this.userName}/followings`, {
          userName     : this.userName,
          followingName: this.followingName
        }));
        this.isFollowing = true;
        this.label = `@${this.followingName} をアンフォローする`;
      }
      catch(error) {
        console.error('FollowLocalUserComponent#onFollow() : Failed To Follow', error);
      }
    }
    this.isDisabled = false;
  }
}
