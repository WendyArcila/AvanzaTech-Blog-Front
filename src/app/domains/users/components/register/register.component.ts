import { Component, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MyValidators } from '../../../utils/validators';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { RegisterService } from '../../services/register/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule,FontAwesomeModule,
     BtnComponent,  RouterModule, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  form: FormGroup;
  private register = inject(RegisterService)
  duplicateEmail = signal(false);
  changeType:boolean =true;
  visible:boolean = true;
  changeTypeConf:boolean =true;
  visibleConf:boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router

  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nick_name: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: MyValidators.matchPasswords
    });
  }

  ngOnInit() {}


  save(){
    if(this.form.valid){
      this.register.saveNewUser(this.form.value)
      .subscribe({
        next: (data) =>{
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Welcome, your registration was successfully",
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            this.router.navigate(['/login']);
        })
      },
        error: (error) => {
          if('email' in error.error) {
            const errorMsg = error.error.email[0];
            if (errorMsg.includes ('email address already exists')){
              this.existEmail()
              }
          };
        }
      })
    }
  }

  get email(){
    return this.form.get('email')
  }

  get password(){
    return this.form.get('password')
  }

  get nick_name(){
    return this.form.get('nick_name')
  }

  get confirmPassword(){
    return this.form.get('confirmPassword')
  }

  resetForm() {
    this.form.reset();
  }

  existEmail() {
    this.duplicateEmail.set(true);
    console.log('changed email' + this.duplicateEmail());
  }

  viewpass(){
    this.changeType = !this.changeType;
    this.visible = !this.visible;
  }

  viewConfPass(){
    this.changeTypeConf = !this.changeTypeConf ;
    this.visibleConf = !this.visibleConf;
  }
}
