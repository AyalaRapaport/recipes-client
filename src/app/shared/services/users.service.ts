import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable,catchError,map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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

  get users() {
    return this.http.get<User[]>(this.usersURL)
  }

  // signIn(email:string,password:string): Observable<> {
  //   const user = { email: email, password: password };
  //   return this.http.post<User>(this.url+"signin/", user);
  // }
  signIn(email: string, password: string) {
    const user = { email: email, password: password };
    return this.http.post<{ user: User; token: string }>(this.usersURL + "signin/", user)
    // .pipe(
    //   map(response => {
    //     return {
    //       _id: response.user._id,
    //       username: response.user.username,
    //       email: response.user.email,
    //       password: response.user.password,
    //       address: response.user.address,
    //       role: response.user.role,
    //       // __v: response.user.__v
    //     };
      // }),
    //   catchError(error => {
    //     console.error(error); 
    //     return throwError(error); 
    //   })
      
    // );
  }
  signUp(user: User): Observable<User> {
    return this.http.post<User>(this.usersURL + "signup/", user)
  }
}
