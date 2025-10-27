import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoLikeResponse } from '../response/videoLikeResponse';
import { LikeType } from '../enum/likeType';

@Injectable({
  providedIn: 'root'
})
export class ClipInteractionService {

  private apiUrl: string = `${environment.BASE_URL}/videos`;

  constructor(private http: HttpClient) { }

  public likeClip(id: number): Observable<VideoLikeResponse>{
    return this.http.post<VideoLikeResponse>(`${this.apiUrl}/${id}/like`, null);
  }

  public dislikeClip(id: number): Observable<VideoLikeResponse>{
    return this.http.post<VideoLikeResponse>(`${this.apiUrl}/${id}/dislike`, null);
  }

  public view(id: number): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}/${id}/view`, null);
  }

  public getLikeStatus(id: number): Observable<LikeType>{
    return this.http.get<LikeType>(`${this.apiUrl}/${id}/like-status`);
  }
}
