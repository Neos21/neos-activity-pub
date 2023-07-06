import { Component, OnInit } from '@angular/core';

import { AuthService } from './shared/services/auth.service';

/** App Component */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /** Title */
  public title: string = 'Neo\'s ActivityPub';
  
  constructor(private readonly authService: AuthService) { }
  
  /** アプリ初期表示時 */
  public async ngOnInit(): Promise<void> {
    this.authService.autoReLogin();  // ログイン済のユーザが再描画した時に復旧する
  }
}
