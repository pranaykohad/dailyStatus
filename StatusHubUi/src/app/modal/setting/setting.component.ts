import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { Setting } from 'src/app/model/Setting';
import { LocalStorageService } from 'src/services/local-storage.service';
import { SettingService } from 'src/services/setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  END_TIME_KEY = 'END_TIME';
  endTime: string;
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor(
    private localStorageService: LocalStorageService,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.endTime = this.localStorageService.getSettingByKey(this.END_TIME_KEY);
  }

  submitSetting() {
    const setting: Setting = {
      keyName: this.END_TIME_KEY,
      value: this.endTime,
    };
    this.settingService.saveSetting(setting).subscribe((res) => {
      this.setSettings();
    });
  }

  private setSettings() {
    this.settingService.getAllSettings().subscribe((res) => {
      this.localStorageService.setSettings(res['data']);
    });
  }
}
