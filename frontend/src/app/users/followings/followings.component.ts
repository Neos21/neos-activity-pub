import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { FollowingsService } from './followings.service';

import { Following } from 'src/app/shared/classes/following';

@Component({
  selector: 'app-followings',
  templateUrl: './followings.component.html',
  styleUrls: ['./followings.component.css']
})
export class FollowingsComponent {
  /** ユーザ名 */
  public userName?: string;
  /** フォロー中一覧 */
  public followings?: Array<Following>;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private followingsService: FollowingsService
  ) { }
  
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (params: ParamMap): Promise<void | boolean> => {
      const name = params.get('name');
      if(name == null) return this.router.navigate(['/']);  // ユーザ名が未指定の場合はトップに戻す
      this.userName = name;
      
      const followings = await this.followingsService.findAll(name);
      if(followings == null) return this.router.navigate(['/']);  // ユーザが見つからなかった場合 (404)・サーバエラー時
      this.followings = followings;
    });
  }
}
