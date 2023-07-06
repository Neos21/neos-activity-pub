import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';

/** ホーム画面 (ログイン後トップ) */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }
  
  public ngOnInit(): void {
    this.test();  // TODO
  }
  
  // TODO
  public async test(): Promise<void> {
    const result = await firstValueFrom(this.httpClient.get('/api/auth/test'));
    console.log('TODO : Test', result);
  }
  
  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
