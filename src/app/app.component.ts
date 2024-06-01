import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { User } from './shared/models/user';
import { MatCardModule } from '@angular/material/card';
import { UsersService } from './shared/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, UpperCasePipe, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private userService: UsersService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isTokenValid();
    if (this.isLoggedIn() && !this.isToken) {
      this._snackBar.open('עליך לבצע התחברות מחדש', 'כניסה', {
        verticalPosition: 'top',
      }).onAction().subscribe(() => {
        const currentUserString = localStorage.getItem('currentUser');
        if (currentUserString) {
          const currentUser = JSON.parse(currentUserString);
          const email = currentUser.email;
          console.log(email);

          this.router.navigateByUrl('login', { state: { email: email } });
        }
      });
    }
  }

  isToken: boolean | string | null = false
  showProfile: boolean = false;
  isManager: boolean = this.authService.currentUser?.role == 'admin'
  title = 'recipes';

  isTokenValid() {

    this.isToken = this.userService.token
  }

  isShowProfile() {
    this.showProfile = !this.showProfile
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  getFirst(): string {
    return this.authService.currentUser?.username ? this.authService.currentUser.username[0] : "a"
  }
  getUser(): User | undefined {
    return this.authService.currentUser
  }

  logOut() {
    this.authService.logout();
    this.showProfile = false
    this.userService.token = null;
  }

}
