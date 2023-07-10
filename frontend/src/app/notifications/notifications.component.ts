import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationsService } from './notifications.service';

import { Notification } from '../shared/classes/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  /** 通知一覧 */
  public notifications?: Array<Notification>;
  
  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
  ) { }
  
  public async ngOnInit(): Promise<void> {
    try {
      this.notifications = await this.notificationsService.findAll();  // Throws
    }
    catch(_error) {
      this.router.navigate(['/']);  // ユーザが見つからなかった場合 (404)・サーバエラー時
    }
  }
}
