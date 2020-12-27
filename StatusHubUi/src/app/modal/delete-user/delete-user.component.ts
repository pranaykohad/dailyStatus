import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent implements OnInit {
  @Input() userList: User[];
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor() {}

  ngOnInit(): void {}
}
