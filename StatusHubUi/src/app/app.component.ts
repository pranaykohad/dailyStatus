import { Component } from '@angular/core';
import { FullCalendarModule } from 'primeng/fullcalendar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {
    const name = FullCalendarModule.name;
  }
}
