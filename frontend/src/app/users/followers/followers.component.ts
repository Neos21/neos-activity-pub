import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { FollowersService } from './followers.service';

import { Follower } from 'src/app/shared/classes/follower';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent {
  /** ユーザ名 */
  public userName?: string;
  /** フォロワー一覧 */
  public followers?: Array<Follower>;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private followersService: FollowersService
  ) { }
  
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (params: ParamMap): Promise<void | boolean> => {
      const name = params.get('name');
      if(name == null) return this.router.navigate(['/']);  // ユーザ名が未指定の場合はトップに戻す
      this.userName = name;
      
      const followers = await this.followersService.findAll(name);
      if(followers == null) return this.router.navigate(['/']);  // ユーザが見つからなかった場合 (404)・サーバエラー時
      this.followers = followers;
    });
  }
}
