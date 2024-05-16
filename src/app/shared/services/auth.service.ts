import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser:User|undefined
  isLoggedIn:boolean=false
  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }
  constructor() { }
}
