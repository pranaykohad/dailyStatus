import { Injectable } from '@angular/core';
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

  resetLocalStorage() {
    localStorage.clear();
  }
}
