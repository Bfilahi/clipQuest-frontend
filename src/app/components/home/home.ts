import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ClipResponse } from '../../response/clipResponse';
import { ClipService } from '../../services/clipService';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from "@angular/router";
import { ModalService } from '../../services/modal-service';


@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy{
  public clips = signal<ClipResponse[]>([]);

  constructor(private clipService: ClipService, private modalService: ModalService){}


  ngOnInit(): void {
    this.modalService.register('auth');
    this.listClips();
  }

  ngOnDestroy(): void {
    this.modalService.unregister('auth');
  }

  private listClips(){
    this.clipService.getClips().subscribe({
      next: (data: ClipResponse[]) => {
        this.clips.set(data);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }


}
