import { Component, OnInit } from '@angular/core';

import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string = 'Neo\'s ActivityPub';  // TODO : いつか消す
  
  constructor(private readonly authService: AuthService) { }
  
  /** アプリ初期表示時 */
  public ngOnInit(): void {
    this.authService.autoReLogin();  // ログイン済のユーザが再描画した時に復旧する
  }
}
