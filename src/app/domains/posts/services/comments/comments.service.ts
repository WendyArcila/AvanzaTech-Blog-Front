import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DataResponseComment } from '../../models/data';
import { Commentary } from '../../models/commentary';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {


  private http = inject(HttpClient)

  constructor() { }

  saveComment(blog_post: number, comment: string){
    const data= {
      blog_post: blog_post,
      comment: comment
    }
    return this.http.post<Commentary>('http://localhost:8000/comments/',data , {withCredentials: true})
  }

}
