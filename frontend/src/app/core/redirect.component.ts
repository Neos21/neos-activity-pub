import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** リダイレクト用コンポーネント */
@Component({
  selector: 'app-redirect',
  template: '',
  styles: ['']
})
export class RedirectComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  
  public ngOnInit(): void | Promise<boolean> {
    const path = this.activatedRoute.snapshot.url?.[0]?.path;
    
    // `@` から始まる URL の場合はユーザプロフィール画面に遷移させる
    if(path != null && path.startsWith('@')) {
      const name = path.slice(1);
      console.log('RedirectComponent : Redirect To User Profile Page', { path, name });
      return this.router.navigate(['/users', name], { skipLocationChange: true })
    }
    
    // それ以外はトップに遷移させる
    this.router.navigate(['/']);
  }
}
