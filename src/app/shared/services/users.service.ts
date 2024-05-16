import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable,catchError,map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _users: User[] = []
  url: string = "http://localhost:5000/users/"

  constructor(private http: HttpClient) { }

  get users() {
    return this.http.get<User[]>(this.url)
  }

  // signIn(email:string,password:string): Observable<> {
  //   const user = { email: email, password: password };
  //   return this.http.post<User>(this.url+"signin/", user);
  // }
  signIn(email: string, password: string): Observable<User> {
    const user = { email: email, password: password };
    return this.http.post<any>(this.url + "signin/", user).pipe(
      map(response => {
        return {
          _id: response.user._id,
          username: response.user.username,
          email: response.user.email,
          password: response.user.password,
          address: response.user.address,
          role: response.user.role,
          __v: response.user.__v
        };
      }),
      catchError(error => {
        console.error(error); 
        return throwError(error); 
      })
      
    );
  }
  signUp(user: User): Observable<User> {
    return this.http.post<User>(this.url + "signup/", user)
  }
}
