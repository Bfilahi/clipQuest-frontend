import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ClipService } from '../../services/clipService';
import { ClipResponse } from '../../response/clipResponse';
import { HttpErrorResponse } from '@angular/common/http';
import videojs from 'video.js';
import { Auth } from '../../services/auth';
import { ClipInteractionService } from '../../services/clip-interaction-service';
import { VideoLikeResponse } from '../../response/videoLikeResponse';
import { LikeType } from '../../enum/likeType';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal-service';
import { CommentService } from '../../services/comment-service';
import { CommentResponse } from '../../response/commentResponse';
import { FormsModule, NgForm } from '@angular/forms';




@Component({
  selector: 'app-clip',
  imports: [CommonModule, FormsModule],
  templateUrl: './clip.html',
  styleUrl: './clip.css'
})
export class Clip implements OnInit{
  @ViewChild('videoPlayer', {static: true}) target!: ElementRef;

  public LikeType = LikeType;

  public id: number = 0;
  public clip = signal<ClipResponse | null>(null);
  public likesCount = signal<number>(0);
  public dislikesCount = signal<number>(0);
  public likeStatus = signal<LikeType | null>(null);
  public comments = signal<CommentResponse[]>([]);
  public userComments = signal<CommentResponse[]>([]);


  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private clipService: ClipService,
    private clipInteractionService: ClipInteractionService,
    private modalService: ModalService,
    private authService: Auth
  ){}



  public ngOnInit(): void {
    this.route.params.subscribe((params: Params)=> {
      this.id = params?.['id'];
      this.registerView();
    });

    if(this.authService.isLoggedIn())
      this.getLikeInfo();
  }


  public like(){
    if(!this.authService.isLoggedIn()){
      this.modalService.toggleModal('auth');
      return;
    }

    this.clipInteractionService.likeClip(this.id).subscribe({
      next: (data: VideoLikeResponse) => {
        this.likesCount.set(data.likesCount);
        this.dislikesCount.set(data.dislikesCount);
        this.likeStatus.set(data.userLikeStatus);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }


  public dislike(){
    if(!this.authService.isLoggedIn()){
      this.modalService.toggleModal('auth');
      return;
    }

    this.clipInteractionService.dislikeClip(this.id).subscribe({
      next: (data: VideoLikeResponse) => {
        this.likesCount.set(data.likesCount);
        this.dislikesCount.set(data.dislikesCount);
        this.likeStatus.set(data.userLikeStatus);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  public addComment(form: NgForm){
    if(!this.authService.isLoggedIn()){
      this.modalService.toggleModal('auth');
      return;
    }

    this.commentService.addComment(this.id, form.value.comment).subscribe({
      next: (data: CommentResponse) => {
        this.comments.update((prev) => [...prev, data]);
        this.userComments.update((prev) => [...prev, data]);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });

    form.reset();
  }


  public deleteComment(event: Event, id: number){
    event.preventDefault();

    if(!confirm('Are you sure you want to delete this comment?'))
      return;

    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.getComments();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }


  public checkUserComment(id: number): boolean{
    return this.userComments().some(c => c.id === id);
  }


  private registerView(){
    this.clipInteractionService.view(this.id).subscribe({
      next: () => {
        this.getClip();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }


  private getClip(){
    const player = videojs(this.target.nativeElement);
    
    this.clipService.getClip(this.id).subscribe({
      next: (data: ClipResponse) => {
        this.clip.set(data);
        this.likesCount.set(data.videoLikeResponse.likesCount);
        this.dislikesCount.set(data.videoLikeResponse.dislikesCount);

        this.getComments();

        player.src({
          src: this.clip()?.pathFile,
          type: 'video/mp4',
        });
        player.autoplay(true);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  private getLikeInfo(){
    this.clipInteractionService.getLikeStatus(this.id).subscribe({
      next: (data: LikeType) => {
        this.likeStatus.set(data);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });


  }


  private getComments(){
    this.commentService.getVideoComments(this.id).subscribe({
      next: (data: CommentResponse[]) => {
        this.comments.set(data);

        if(this.comments().length > 0){
          if(this.authService.isLoggedIn())
            this.getUserComments();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }


  private getUserComments(){
    this.commentService.getUserComments(this.id).subscribe({
      next: (data: CommentResponse[]) => {
        this.userComments.set(data);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

}
