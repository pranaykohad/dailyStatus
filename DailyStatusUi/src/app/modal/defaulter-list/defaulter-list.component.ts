import { Component, OnInit } from '@angular/core';
import { DatePicker } from 'src/app/model/datePicker';
import { User } from 'src/app/model/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-defaulter-list',
  templateUrl: './defaulter-list.component.html',
  styleUrls: ['./defaulter-list.component.scss'],
})
export class DefaulterListComponent implements OnInit {
  today: DatePicker;
  defaulterList: User[];
  message: string = null;

  constructor(private userService: UserService) {
    const today = new Date();
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
  }
  ngOnInit(): void {
    this.userService
      .defaultersList(
        `${this.today.month}/${this.today.day}/${this.today.year}`
      )
      .subscribe((res) => {
        if (res['description']) {
          this.message = 'No Defaulter Today';
        } else {
          this.defaulterList = res['data'];
        }
      });
  }
}
