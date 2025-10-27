import { Component, OnInit } from '@angular/core';
import { ClipResponse } from '../../response/clipResponse';
import { ClipService } from '../../services/clipService';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
  public clips: ClipResponse[] = [];

  constructor(private clipService: ClipService){}

  ngOnInit(): void {
    this.listClips();
  }

  private listClips(){
    this.clipService.getClips().subscribe({
      next: (data: ClipResponse[]) => {
        this.clips = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }


}
