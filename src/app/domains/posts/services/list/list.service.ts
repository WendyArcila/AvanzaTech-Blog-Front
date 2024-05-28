import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataResponsePost } from '../../models/data';


@Injectable({
  providedIn: 'root'
})
export class ListService {


  private http = inject(HttpClient)

  constructor() { }

  listPost(url: string){

    return this.http.get<DataResponsePost>(url, {withCredentials: true})
  }



}

