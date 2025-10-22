import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal-service';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth';


@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal implements OnInit{
  @Input() modalID = '';

  constructor(
    public authService: Auth,
    public modalService: ModalService,
    public el: ElementRef
  ){}

  public ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement);
  }

  public closeModal(){
    this.modalService.toggleModal(this.modalID);
  }
}
