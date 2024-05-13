import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from "../register/register.component";
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

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
  imports: [MatIconModule,MatButtonModule, CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, RegisterComponent]
})

export class LoginComponent {
  hide = true;
  @Output() details = new EventEmitter<{ username: string, password: string }>();
  usernameFormControl = new FormControl('', [Validators.required, Validators.pattern(USERNAME_REGEX), Validators.minLength(2)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(4)])
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router) { }

  login(name: string, pass: string) {
    if (pass === '123') {
      this.router.navigateByUrl("allrecipes");
    } else {
      this.details.emit({ username: name, password: pass })
      this.router.navigate(['register']);
    }
  }
}
