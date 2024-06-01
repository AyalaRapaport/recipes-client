import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from "../register/register.component";
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../shared/services/users.service';
import { AuthService } from '../../shared/services/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
const USERNAME_REGEX = /^[a-zA-Zא-ת\s]{2,}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [MatIconModule, MatButtonModule, CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, RegisterComponent]
})

export class LoginComponent implements OnInit {
  hide = true;
  passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(this.passwordRegex)])
  matcher = new MyErrorStateMatcher();
  emailV: string = ''

  constructor(private router: Router, private userService: UsersService, private authService: AuthService) { }

  ngOnInit(): void {
    const state = history.state;
    if (state && state.email) {
      this.emailV = state.email;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userService.signIn(email, password).toPromise();
      if (user?.user.email) {
        this.authService.login(user);
        this.router.navigateByUrl("allrecipes");
        this.userService.token = user.token;
      } else {
        this.router.navigate(['register'], { state: { details: { email, password } } });
      }
    } catch (error) {
      console.error("An error occurred while signing in:", error);
      this.router.navigate(['register'], { state: { details: { email, password } } });
    }
  }
}
