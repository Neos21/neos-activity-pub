import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';

/** ホーム画面 (ログイン後トップ) */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /** ユーザ名 */
  public name!: string;
  
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }
  
  public ngOnInit(): void {
    this.name = this.authService.name;
  }
  
  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
