import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { PostsService } from './posts.service';

import { Post } from 'src/app/shared/classes/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  /** 投稿一覧 */
  public posts?: Array<Post>;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private postsService: PostsService
  ) { }
  
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (params: ParamMap): Promise<void | boolean> => {
      const name = params.get('name');
      if(name == null) return this.router.navigate(['/']);  // ユーザ名が未指定の場合はトップに戻す
      try {
        this.posts = await this.postsService.findAll(name);  // Throws
      }
      catch(_error) {
        this.router.navigate(['/']);  // ユーザが見つからなかった場合 (404)・サーバエラー時
      }
    });
  }
}
