import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user';
import { AuthService } from '../../shared/services/auth.service';

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
  imports: [MatIconModule, MatButtonModule, CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule]
})


export class RegisterComponent {
  emailV: string = ''
  password: string = ''

  ngOnInit() {
    const state = history.state;
    if (state && state.details) {
      this.emailV = state.details.email;
      this.password = state.details.password;
      console.log(this.emailV);

    }
  }
  passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
  hide = true;
  usernameFormControl = new FormControl('', [Validators.required, Validators.pattern(USERNAME_REGEX), Validators.minLength(2)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(4),Validators.pattern(this.passwordRegex)])
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  addressFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private userService: UsersService,private authService:AuthService) { }

  signUp(name: string, pass: string, email: string, address: string) {
    const user: User = {
      username: name,
      password: pass,
      email: email,
      address: address,
    };
    this.userService.signUp(user)
      .subscribe(newUser => {
        this.authService.login(newUser);
        console.log('הרישום הושלם!', newUser);
        this.router.navigateByUrl('allrecipes');
      }, error => {
        console.error('שגיאה :', error);
      });
  }
}
