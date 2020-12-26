import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { stateList } from 'src/app/app.constant';
import { Status } from 'src/app/model/status';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
})
export class RowComponent implements OnInit {
  @Input() status: Status;
  @Input() index: number;
  stateList: string[];
  constructor() {
    this.stateList = stateList;
  }

  ngOnInit(): void {}

  changeState(index: number, status: Status) {
    status.state = this.stateList[index];
  }
}
