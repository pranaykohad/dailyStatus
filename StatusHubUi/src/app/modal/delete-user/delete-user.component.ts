import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { User } from 'src/app/model/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent {
  selectedUserId: string;
  @Input() userList: User[];
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
}
