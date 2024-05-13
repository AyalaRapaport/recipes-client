import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @Input() username: string = '';
  @Input() password: string = '';
  // username: string = '';
  // password: string = '';
constructor(){console.log("in"+this.username)}
  // receiveCredentials(details: {username: string, password: string}) {
  //   this.username = details.username;
  //   this.password = details.password;

  //   console.log(this.username);
    
  // }
  receiveDetails(event: any) {    
    const target = event.target as HTMLInputElement; 
    if (target) {
      const details = target.value; 
      console.log(details);
    }
  }
  
  
  
}
