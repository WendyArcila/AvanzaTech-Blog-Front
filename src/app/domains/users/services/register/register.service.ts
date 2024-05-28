import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/user';



@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private http = inject(HttpClient)

  constructor() { }

  saveNewUser(data:User){
    return this.http.post<User>('http://localhost:8000/user/signup/', data, {withCredentials: true} )
  }
}
