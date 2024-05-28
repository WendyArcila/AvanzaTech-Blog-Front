import { CommonModule, } from '@angular/common';
import { Component,  inject,  signal } from '@angular/core';
import { FormGroup, FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import {MatIconModule} from '@angular/material/icon';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LoginService } from '../../services/login/login.service';
import { LocalStorageService } from '../../../shared/services/storage.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    BtnComponent,
    RouterModule,
    MatIconModule,
    HeaderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  private login = inject(LoginService);
  nonEmail = signal(false);
  nonMatch = signal(false);
  changeType:boolean = true;
  visible:boolean = true;
  user : string = '';
  team : string = '';


  constructor(
    private FormBuilder: FormBuilder,
    private router: Router,
    private local: LocalStorageService,
  ){
    this.form = this.FormBuilder.group({
      username:['', [Validators.required, Validators.email]],
      password: ['', [Validators.required ]]
    });
  }

  save(){
    if(this.form.valid){
      this.login.loginUser(this.form.value)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.local.setStorage('userAuth',response.nick_name);
          this.local.setStorage('teamUserAuth',response.team_name);
          this.local.setStorage('idUserAuth', JSON.stringify(response.id));
          
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Welcome, your authentication was successfully",
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            this.router.navigate(['']);
        })

      },
        error: (error) => {
          console.log(error);
          if('non_field_errors' in error.error) {
            const errorMsg = error.error.non_field_errors;
            if (errorMsg[0].includes('A user with this email was not found.')){
              this.existEmail()
              }
            else if (errorMsg[0].includes('The password or email are incorrect')) {
              this.matchPassword();
            }
          };
        }
      })
    }
    };

    private extractSessionId(setCookieHeader: string | null): string | null {
      if (!setCookieHeader) {
        return null;
      }
      const cookies = setCookieHeader.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.trim() === 'sessionid') {
          return value;
        }
      }
      return null;
    }

  get username(){
    return this.form.get('username')
  };

  get password(){
    return this.form.get('password')
  };

  existEmail() {
    this.nonEmail.set(true);
  };

  matchPassword() {
    this.nonMatch.set(true);
  };

  resetForm() {
    this.form.reset();
  };

  viewpass(){
    this.changeType = !this.changeType;
    this.visible = !this.visible;
  }

}
