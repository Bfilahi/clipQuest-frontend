import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModalService } from '../../../services/modal-service';
import { Edit } from "../edit/edit";
import { ClipResponse } from '../../../response/clipResponse';
import { ClipService } from '../../../services/clipService';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-manage',
  imports: [Edit, RouterLink],
  templateUrl: './manage.html',
  styleUrl: './manage.css'
})
export class Manage implements OnInit{

  public activeClip!: ClipResponse;
  public clips = signal<ClipResponse[]>([]);


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private clipService: ClipService
  ){}

  public ngOnInit(): void {
    this.listUserClips();
  }

  public openModal(event: Event, clip: ClipResponse){
    event.preventDefault();

    this.activeClip = clip;
    this.modalService.toggleModal('editClip');
  }

  public refresh(event: ClipResponse){
    const currentClips = this.clips();

    currentClips.forEach(c => {
      if(c.id === event.id){
        c.title = event.title;
        c.description = event.description;
      }
    });

    this.clips.set(currentClips);
  }

  public listUserClips(){
    this.clipService.getUserClips().subscribe({
      next: (data: ClipResponse[]) => {
        this.clips.set(data);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }
}
