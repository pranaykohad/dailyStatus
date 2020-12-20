import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  private _message: string;
  @Input() type: string = 'fail';

  constructor(private cdrf: ChangeDetectorRef) {
    this.message = null;
  }

  @Input()
  set message(message: string) {
    if (message) {
      this._message = message;
      setTimeout(() => {
        this._message = null;
        this.cdrf.markForCheck();
      }, 5000);
    }
  }

  get message() {
    return this._message;
  }
}
