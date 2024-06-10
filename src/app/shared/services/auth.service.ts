import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { SignResponse, UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UsersService) {
    this.loadFromsessionStorage();
  }

  private currentUserSubject = new BehaviorSubject<User | undefined>(undefined);
  currentUser$ = this.currentUserSubject.asObservable();
  currentUser: User | undefined
  currentToken: string | undefined
  isLoggedIn: boolean = false

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  login(res: SignResponse) {
    this.currentUser = res.user;
    this.isLoggedIn = true;
    this.currentToken = res.token;
    this.saveTosessionStorage();
    this.userService.setLoginStatus(true);
  }

  logout() {
    this.currentUser = undefined;
    this.currentToken = undefined;
    this.isLoggedIn = false;
    this.clearsessionStorage();
    this.userService.setLoginStatus(true)
  }

  private loadFromsessionStorage() {
    const storedUser = sessionStorage.getItem('currentUser');
    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn')
    if (storedUser)
      this.currentUser = JSON.parse(storedUser);
    if (storedIsLoggedIn)
      this.isLoggedIn = JSON.parse(storedIsLoggedIn)
  }

  private saveTosessionStorage() {
    if (this.currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
    sessionStorage.setItem('isLoggedIn', JSON.stringify(this.isLoggedIn));
  }
  private clearsessionStorage() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('usertoken');
    sessionStorage.removeItem('time');
  }
}
