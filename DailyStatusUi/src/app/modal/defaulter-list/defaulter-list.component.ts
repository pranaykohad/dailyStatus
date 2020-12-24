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
  message: string = '';
  private _defaulterList: User[];

  @Input()
  set defaulterList(defaulterList: User[]) {
    this._defaulterList = defaulterList;
    if (this._defaulterList && !this._defaulterList.length) {
      this.message = 'No Defaulter Today';
    }
  }

  get defaulterList() {
    return this._defaulterList;
  }
}
