import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private http = inject(HttpClient)

  constructor() { }

  logoutUser() {
    return this.http.get('http://localhost:8000/user/logout/', {withCredentials:true});
  }
}
