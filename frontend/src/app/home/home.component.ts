import { Component } from '@angular/core';

/** Home Component */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  /** Title */
  public title: string = 'Home';
}
