import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Alert } from 'src/app/model/alert';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor() {}

  ngOnInit(): void {}
}
