import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.css']
})
export class FollowButtonComponent implements OnInit {
  /** フォロー対象のユーザ ID (URL) */
  @Input()
  public targetUserId?: string;
  
  public ngOnInit(): void {
    
  }
}
