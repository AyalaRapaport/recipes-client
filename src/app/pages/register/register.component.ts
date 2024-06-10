import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SignResponse, UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
const USERNAME_REGEX = /^[a-zA-Zא-ת\s]{2,}$/;

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [MatIconModule, MatAutocompleteModule, MatButtonModule, CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule]
})


export class RegisterComponent {
  constructor(private router: Router, private userService: UsersService, private authService: AuthService, private _snackBar: MatSnackBar) { }

  emailV: string = ''
  password: string = ''
  domains: string[] = ['gmail.com', 'yahoo.com', 'outlook.com', 'walla.co.il', 'hotmail.com'];
  filteredDomains: string[] = [];
  passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
  hide = true;
  usernameFormControl = new FormControl('', [Validators.required, Validators.pattern(USERNAME_REGEX), Validators.minLength(2)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(this.passwordRegex)])
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  addressFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  ngOnInit() {
    const state = history.state;
    if (state && state.details) {
      this.emailV = state.details.email;
      this.password = state.details.password;
      console.log(this.emailV);
    }
    this.emailFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    ).subscribe(filtered => this.filteredDomains = filtered);
  }

  private _filter(value: string): string[] {
    const filterValue = value?.toLowerCase();
    const atIndex = filterValue?.indexOf('@') ? filterValue?.indexOf('@') : 0;

    if (atIndex >= 0) {
      const enteredDomain = filterValue?.substring(atIndex + 1);
      return this.domains.filter(domain => domain.startsWith(enteredDomain));
    } else {
      return [];
    }
  }

  onOptionSelected(event: any): void {
    this.emailV = event.option.value;
  }

  signUp(name: string, pass: string, email: string, address: string) {
    const user: User = {
      username: name,
      password: pass,
      email: email,
      address: address,
    };
    this.userService.signUp(user)
      .subscribe(response => {
        if (response.status === 201) {
          const responseBody: SignResponse = response.body!;
          console.log(responseBody);
          this.userService.token = response.body?.token;
          this.authService.login(responseBody);
          this.router.navigateByUrl('allrecipes');
        }
        else {
          this._snackBar.open('אימייל כבר קיים', 'סגור', { verticalPosition: 'top', });
        }
      }, error => {
        if (error.status === 409) {
          console.error('משתמש כבר קיים', error);
        } else {
          console.error('שגיאה :', error);
        }
      });
  }
}
