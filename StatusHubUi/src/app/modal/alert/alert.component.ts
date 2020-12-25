import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  private _message: string;
  @Input() type: string = 'fail';
  alertTimeout: any;

  constructor(private cdrf: ChangeDetectorRef) {
    this.message = null;
  }

  @Input()
  set message(message: string) {
    this._message = message;
    if (message) {
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
      this.alertTimeout = setTimeout(() => {
        this._message = null;
        this.cdrf.markForCheck();
      }, 5000);
    }
  }

  get message() {
    return this._message;
  }
}
