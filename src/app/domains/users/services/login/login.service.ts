import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../../model/user';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient)

  constructor() { }

  loginUser(data: User) {
    return this.http.post<User>('http://localhost:8000/user/login/', data, {
        withCredentials: true
        });
  }
}
