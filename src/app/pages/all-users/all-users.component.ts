import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../shared/models/user';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent implements OnInit {

  displayedColumns: string[] = ['username', 'email', 'role', 'address'];
  usersList: User[] = [];
  isShowList: boolean = false

  constructor(private userService: UsersService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    console.log("in");
    if (this.userService.token)

      this.userService.allUsers().subscribe(
        users => {
          console.log(users);
          if (!users.length) {

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
          } else {
            this.usersList = users;
            this.isShowList = true;
          }
        },
        error => {
          this._snackBar.open('עליך לבצע כניסה מחדש', 'סגור', { verticalPosition: 'top', });
          console.error(error);
        }
        // if ((users as any).error) {
        //   const error = (users as any).error;
        //   this._snackBar.open('עליך לבצע כניסה מחדש', 'סגור', { verticalPosition: 'top', });

        //   console.error('Error:', error);
        //   if (error.name === 'TokenExpiredError' && error.message === 'jwt expired') {
        //     console.log('JWT expired at:', error.expiredAt);
        //   }
        // } else {
        //   this.usersList=users;
        //   console.log('Users:', users);
        // }

      );


  }


}
