import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Clip {



  // public getUserClips(sort$: BehaviorSubject<string>){
  //   return combineLatest([
  //     // this.auth.user,
  //     sort$
  //   ]).pipe(
  //     // switchMap(user => )
  //   )
  // }

  public updateClip(id: string, title: string){

  }
}
