import { Component, Input } from '@angular/core';
import { DatePicker } from 'src/app/model/datePicker';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-defaulter-list',
  templateUrl: './defaulter-list.component.html',
  styleUrls: ['./defaulter-list.component.scss'],
})
export class DefaulterListComponent {
  today: DatePicker;
  message: string = 'No Defaulter Today';
  @Input() defaulterList: User[];
}
