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
      try {
        this.followers = await this.followersService.findAll(name);  // Throws
      }
      catch(_error) {
        this.router.navigate(['/']);  // ユーザが見つからなかった場合 (404)・サーバエラー時
      }
    });
  }
}
