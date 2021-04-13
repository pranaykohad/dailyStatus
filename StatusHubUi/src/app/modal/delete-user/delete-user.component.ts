import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { IUser, User } from 'src/app/model/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent {
  message: string = 'No user found';
  selectedUserId: string;
  userList: IUser[];
  @Input() user: User;
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor(private userService: UserService) {}

  deleteUser() {
    if (!this.selectedUserId) {
      this.alertEmitter.emit({
        message: 'Please select the user',
        type: 'fail',
      });
    } else {
      this.userService.deleteUser(this.selectedUserId).subscribe((res) => {
        if (res['status'] === 'SUCCESS') {
          this.selectedUserId = null;
        }
        this.alertEmitter.emit({
          message: res['description'],
          type: res['status'],
        });
      });
    }
  }

  getUserList() {
    this.userList = [];
    this.userService.findAllUsersButAmin().subscribe((res) => {
      if (res['status'] === 'FAILURE') {
        const alert: Alert = {
          message: res['description'],
          type: res['status'],
        };
        this.alertEmitter.emit(alert);
      } else {
        this.userList = res['data'];
      }
    });
  }
}
