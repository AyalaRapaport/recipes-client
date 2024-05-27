import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable,catchError,map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface SignResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _users: User[] = []
  private usersURL = `${environment.apiURL}/users/`;

  constructor(private http: HttpClient) { }

  public get token(): string | null {
    return localStorage.getItem('usertoken');
  }

  public set token(token: string | null) { 
    if(token==null)
      localStorage.setItem('usertoken', '');
   
    if (token) {      
      localStorage.setItem('usertoken', token);
    }
  }

   allUsers() {
    return this.http.get<User[]>(this.usersURL)
  }

  // signIn(email:string,password:string): Observable<> {
  //   const user = { email: email, password: password };
  //   return this.http.post<User>(this.url+"signin/", user);
  // }
  signIn(email: string, password: string) {
    const user = { email: email, password: password };
    return this.http.post<{ user: User; token: string }>(this.usersURL + "signin/", user)
  }
  signUp(user: User): Observable<HttpResponse<SignResponse>> {
    return this.http.post<SignResponse>(this.usersURL + "signup/", user, { observe: 'response' });
  }
}
