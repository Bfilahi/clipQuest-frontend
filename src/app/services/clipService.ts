import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ClipResponse } from '../response/clipResponse';
import { ClipRequest } from '../request/clipRequest';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

  private apiUrl: string = `${environment.BASE_URL}/videos`;


  constructor(private http: HttpClient){}


  public getClips(): Observable<ClipResponse[]>{
    return this.http.get<ClipResponse[]>(this.apiUrl);
  }

  public getUserClips(): Observable<ClipResponse[]>{
    return this.http.get<ClipResponse[]>(`${this.apiUrl}/user`);
  }

  public getClip(id: number): Observable<ClipResponse>{
    return this.http.get<ClipResponse>(`${this.apiUrl}/video/${id}`);
  }

  public uploadClip(request: FormData): Observable<ClipResponse>{
    return this.http.post<ClipResponse>(`${this.apiUrl}/user/upload-video`, request);
  }

  public deleteClip(id: number){
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`);
  }

  public updateClip(id: number, request: ClipRequest): Observable<ClipResponse>{
    return this.http.put<ClipResponse>(`${this.apiUrl}/user/edit/${id}/video`, request);
  }
}
