import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | undefined>(undefined);
  currentUser$ = this.currentUserSubject.asObservable();
  currentUser: User | undefined
  isLoggedIn: boolean = false
  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }
  constructor() {
    this.loadFromLocalStorage();
  }

  login(user: User): void {
    this.currentUser = user;
    this.isLoggedIn = true;
    this.saveToLocalStorage();
  }

  logout(): void {
    this.currentUser = undefined;
    this.isLoggedIn = false;
    this.clearLocalStorage();
  }

  private loadFromLocalStorage() {
    const storedUser = localStorage.getItem('currentUser');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
    if (storedUser)
      this.currentUser = JSON.parse(storedUser);
    if (storedIsLoggedIn)
      this.isLoggedIn = JSON.parse(storedIsLoggedIn)
  }

  private saveToLocalStorage() {
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
    localStorage.setItem('isLoggedIn', JSON.stringify(this.isLoggedIn));
  }
  private clearLocalStorage() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  }
}
