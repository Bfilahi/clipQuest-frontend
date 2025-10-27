import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CommentResponse } from '../response/commentResponse';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl: string = `${environment.BASE_URL}/comments`;

  constructor(private http: HttpClient) { }


  public getVideoComments(id: number): Observable<CommentResponse[]>{
    return this.http.get<CommentResponse[]>(`${this.apiUrl}/video/${id}`);
  }

  public getUserComments(id: number): Observable<CommentResponse[]>{
    return this.http.get<CommentResponse[]>(`${this.apiUrl}/user/${id}`);
  }

  public addComment(id: number, comment: string){
    const formData: FormData = new FormData();
    formData.append('comment', comment);
    return this.http.post<CommentResponse>(`${this.apiUrl}/user/${id}/new-comment`, formData);
  }

  public deleteComment(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`);
  }
}
