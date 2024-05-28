
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, effect, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { LocalStorageService } from '../../services/storage.service';
import { LogoutService } from '../../../users/services/logout/logout.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,
    MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  private logout = inject(LogoutService);
  flag: boolean = false;
  userAuthenticated = signal ('user');


  constructor(
    private local: LocalStorageService,
    private router: Router,
  ){}

  ngOnInit(): void {
    if (this.local.getStorage('userAuth') !== undefined) {
      this.userAuthenticated.set(this.local.getStorage('userAuth') || 'user');
    } else {
      this.userAuthenticated.set('user')
    }

    this.existUser()
  }

  closeSession(){
    this.logout.logoutUser()
    .subscribe({
      next: (response) => {
        this.local.deleteStorage('userAuth');
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your session finished",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['login']);
        })
      },
      error: (error) => {
        console.log(error);
      }
      })
  }

  existUser(){
    if (this.userAuthenticated() !== 'user'){
      this.flag = true
    } else {
      this.flag = false
    }
  }
}
