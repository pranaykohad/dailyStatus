import { Injectable } from '@angular/core';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setUser(user: User) {
    localStorage.setItem('USER', JSON.stringify(user));
    // user.userName = userName;
  }

  setModuleName(moduleName: string, user: User) {
    localStorage.setItem('MODULE_NAME', moduleName);
    user.moduleName = moduleName;
  }

  resetLocalStorage() {
    localStorage.clear();
  }
}
