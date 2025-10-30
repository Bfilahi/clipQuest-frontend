import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../../services/modal-service';
import { Edit } from "../edit/edit";
import { ClipResponse } from '../../../response/clipResponse';
import { ClipService } from '../../../services/clipService';
import { HttpErrorResponse } from '@angular/common/http';
import { Alert } from '../../shared/alert/alert';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-manage',
  imports: [CommonModule, Edit, RouterLink, Alert],
  templateUrl: './manage.html',
  styleUrl: './manage.css'
})
export class Manage implements OnInit{

  public activeClip!: ClipResponse;
  public clips = signal<ClipResponse[]>([]);

  public alertColor: any = 'blue';
  public showAlert: boolean = false;
  public alertMsg: string = 'Please wait!';

  public isLoading = signal<boolean>(true);



  constructor(
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

  public deleteClip(event: Event, clip: ClipResponse){
    event.preventDefault();

    if(!confirm('Are you sure you want to delete this video?'))
      return;

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait!';

    this.clipService.deleteClip(clip.id).subscribe({
      next: () => {
        let currentClips = this.clips();
        currentClips = currentClips.filter(c => c.id != clip.id);
        this.clips.set(currentClips);
        
        this.alertColor = 'green';
        this.alertMsg = 'Clip deleted successfully!.';
        this.showAlert = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.alertColor = 'red';
        this.alertMsg = 'Something went wrong. Try again later.';
        this.showAlert = false;
      }
    });
  }

  public listUserClips(){
    this.clipService.getUserClips().subscribe({
      next: (data: ClipResponse[]) => {
        this.clips.set(data);

        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  public copyLink(event: Event, pathFile: string){
    event.preventDefault();

    if(!pathFile)
      return;

    navigator.clipboard.writeText(pathFile);
  }
}