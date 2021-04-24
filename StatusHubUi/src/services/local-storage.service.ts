import { Injectable } from '@angular/core';
import { Setting } from 'src/app/model/Setting';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setUser(user: User) {
    localStorage.setItem('USER', JSON.stringify(user));
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('USER'));
  }

  setCurrentMonth(currentMonth: string) {
    localStorage.setItem('CURRENT_MONTH', currentMonth);
  }

  getCurrentMonth(): string {
    return localStorage.getItem('CURRENT_MONTH');
  }

  setSettings(settings: Setting[]) {
    localStorage.setItem('SETTINGS', JSON.stringify(settings));
  }

  getSettingByKey(key: string): string {
    const settingList = JSON.parse(localStorage.getItem('SETTINGS'));
    let value = '';
    settingList.forEach((setting) => {
      if (setting.key === key) {
        value = setting.value;
      }
    });
    return value;
  }

  resetLocalStorage() {
    localStorage.clear();
  }
}
