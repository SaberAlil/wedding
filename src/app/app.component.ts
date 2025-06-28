import { Component } from '@angular/core';
import { MarriageCountdownComponent } from "./marriage-countdown/marriage-countdown.component";

@Component({
  selector: 'app-root',
  imports: [MarriageCountdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wedding';
}
