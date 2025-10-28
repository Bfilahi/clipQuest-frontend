import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalService } from '../../../services/modal-service';
import { Modal } from "../../shared/modal/modal";
import { Alert } from "../../shared/alert/alert";
import { InputComponent } from "../../shared/input-component/input-component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClipRequest } from '../../../request/clipRequest';
import { ClipService } from '../../../services/clipService';
import { ClipResponse } from '../../../response/clipResponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, Modal, Alert, InputComponent, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit implements OnInit, OnDestroy{

  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ){}

  @Input() activeClip!: ClipResponse;
  @Output() refresh = new EventEmitter();

  public editForm = new FormGroup({
    clipID: new FormControl('', {nonNullable: true}),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  public showAlert: boolean = false;
  public alertColor: any = 'blue';
  public alertMsg: string = 'Please wait! Updating clip.';
  public inSubmission: boolean = false;


  public ngOnInit(): void {
    this.modalService.register('editClip');
  }

  public ngOnDestroy(): void {
    this.modalService.unregister('editClip');
  }

  public submit(form: FormGroup){
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.';

    const request: ClipRequest = {
      title: form.value.title,
      description: form.value.description
    };

    this.clipService.updateClip(this.activeClip?.id, request).subscribe({
      next: () => {
        this.alertColor = 'green';
        this.alertMsg = 'Success!.';
        form.reset();

        setTimeout(() => this.showAlert = false, 2000);

        const updatedClip: ClipResponse = this.activeClip;
        updatedClip.title = request.title;
        updatedClip.description = request.description;
        this.refresh.emit(updatedClip);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.alertColor = 'red';
        this.alertMsg = 'Something went wrong. Try again later.';
      }
    });
  }

}
