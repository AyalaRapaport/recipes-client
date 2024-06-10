import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, Observable, Subject, catchError, map, of, throwError } from 'rxjs';
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
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  setLoginStatus(s: boolean) {
    this.loginStatusSubject.next(s);
  }
  constructor(private http: HttpClient) { }

  public get token(): string | null | boolean {
    const incomeTimeStr = sessionStorage.getItem('time');
    if (!incomeTimeStr) {
      return false;
    }

    const incomeTime = parseInt(incomeTimeStr, 10);
    const now = Date.now();

    const diffInHours = (now - incomeTime) / (1000 * 60 * 60);

    if (diffInHours < 3) {
      return sessionStorage.getItem('usertoken');
    }
    return false;
  }

  public set token(token: string | null | undefined) {
    // if (token == null) {
    //   debugger
    //   sessionStorage.setItem('usertoken', '');
    //   sessionStorage.setItem('time', Date.now().toString());
    //   // sessionStorage.setItem('time', JSON.stringify(new Date().getTime()));
    // }

    if (token) {
      sessionStorage.setItem('usertoken', token);
      sessionStorage.setItem('time', Date.now().toString());
      // sessionStorage.setItem('time', JSON.stringify(new Date().getTime()));
    }
  }

  allUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersURL).pipe(
      catchError(error => {
        console.error('An error occurred:', error);
        return of([]); // החזרת מערך ריק במקרה של שגיאה
      })
    );
  }

  signIn(email: string, password: string) {
    const user = { email: email, password: password };
    return this.http.post<{ user: User; token: string }>(this.usersURL + "signin/", user)
  }

  signUp(user: User): Observable<HttpResponse<SignResponse>> {
    return this.http.post<{ user: User; token: string }>(this.usersURL + "signup/", user, { observe: 'response' });
  }

  // isTokenValid() {
  //   return this.http.get<boolean>(`${environment.apiURL}/check-token`)
  // }
}
