import { Component } from '@angular/core';

/** Top Component */
@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent {
  /** Title */
  public title: string = 'Top';
}
