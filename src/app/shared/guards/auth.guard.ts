import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UsersService);
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  if (userService.token) {
    return true;
  } else {
    snackBar.open('עליך לבצע התחברות מחדש', 'כניסה', {
      verticalPosition: 'top',
    }).onAction().subscribe(() => {
      const currentUserString = localStorage.getItem('currentUser');
      if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);
        const email = currentUser.email;
        console.log(email);
        
        router.navigateByUrl('login', { state: { email: email } });
      }
    });
    return false;
  }
};
