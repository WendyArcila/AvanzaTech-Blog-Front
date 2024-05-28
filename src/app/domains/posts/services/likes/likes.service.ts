import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DataResponseLike } from '../../models/data';
import { Observable } from 'rxjs';
import { Like } from '../../models/like';


@Injectable({
  providedIn: 'root'
})
export class LikesService {


  private http = inject(HttpClient)

  constructor() { }

  listLikes(blogPostId: number): Observable<DataResponseLike[]> {
    const queryParams = new HttpParams()
     .set('blog_post', blogPostId.toString())

    return this.http.get<DataResponseLike[]>('http://localhost:8000/likes/', {
      params: queryParams,
      withCredentials: true
    });
  }


  createLike(data: {}) {
    return this.http.post<Like>('http://localhost:8000/likes/', data, {
        withCredentials: true
        });
  }

  deleteLike(data:number) {
    const url = `http://localhost:8000/likes/${data}`;
    return this.http.delete<Like>(url, {
        withCredentials: true
        });
  }

}
