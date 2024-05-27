import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { SignResponse } from './users.service';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    this.loadFromLocalStorage();
  }

  private currentUserSubject = new BehaviorSubject<User | undefined>(undefined);
  currentUser$ = this.currentUserSubject.asObservable();
  currentUser: User | undefined
  currentToken:string|undefined
  isLoggedIn: boolean = false
  
  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  login(res: SignResponse) {
    this.currentUser = res.user;
    this.isLoggedIn = true;
    this.currentToken=res.token;
    this.saveToLocalStorage();
  }

  logout() {
    this.currentUser = undefined;
    this.currentToken=undefined;
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
