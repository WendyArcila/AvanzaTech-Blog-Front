import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../models/post';


@Injectable({
  providedIn: 'root'
})
export class DetailService {

    private http = inject(HttpClient)

    constructor() { }

    GetPost(data: string){
      const url = `http://localhost:8000/blogpost/${data}`;
      return this.http.get<Post>(url, {withCredentials: true})
    }

    createPost(data: Post){
      const url = `http://localhost:8000/blogpost/`;
      return this.http.post<Post>(url, data, {withCredentials: true})
    }


    deletePost(data: number){
      const url = `http://localhost:8000/blogpost/${data}`;
      return this.http.delete<Post>(url, {withCredentials: true})
    }

    editPost(id:string, data: Post){
      const url = `http://localhost:8000/blogpost/${id}/`;
      return this.http.put<Post>(url, data, {withCredentials: true})
    }
}
