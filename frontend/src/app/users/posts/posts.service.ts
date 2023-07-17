import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Post } from 'src/app/shared/classes/post';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private httpClient: HttpClient) { }
  
  /** 投稿一覧を取得する */
  public async findAll(userName: string): Promise<Array<Post> | null> {
    const posts = await firstValueFrom(this.httpClient.get<Array<Post>>(`/api/users/${userName}/posts`)).catch(_error => null);
    if(posts == null) return null;
    posts.forEach(post => post.createdAt = post.createdAt.slice(0, 19).replace('T', ' '));  // `YYYY-MM-DD HH:mm:SS` にする
    return posts;
  }
}
