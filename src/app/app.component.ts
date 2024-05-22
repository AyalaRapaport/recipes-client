import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { User } from './shared/models/user';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { UsersService } from './shared/services/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, UpperCasePipe, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showProfile: boolean = false;
  constructor(private authService: AuthService, private userService: UsersService) { }
  title = 'recipes';
  // user: User | undefined = this.authService.currentUser

  isShowProfile() {
    this.showProfile = !this.showProfile
  }
  // isLoggedIn:boolean=this.authService.isLoggedIn
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
    this.userService.token=null;
  }

}
