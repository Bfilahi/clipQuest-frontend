import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalService } from '../../../services/modal-service';
import { Modal } from "../../shared/modal/modal";
import { Alert } from "../../shared/alert/alert";
import { InputComponent } from "../../shared/input-component/input-component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Clip } from '../../../services/clip';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, Modal, Alert, InputComponent, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit implements OnInit, OnDestroy, OnChanges{

  constructor(
    private modalService: ModalService,
    private clipService: Clip
  ){}

  @Input() activeClip: null = null;  // pass the active clip from <app-edit /> in manage.html ([activeClip] = "activeClip")
    // the type is activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  public clipID = new FormControl('', {
    nonNullable: true
  });
  public title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });
  public editForm = new FormGroup({
    title: this.title,
    id: this.clipID
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

  public ngOnChanges(): void {
    if(!this.activeClip)
      return;

    // this.clipID.setValue(this.activeClip.docID);
    // this.clipID.setValue(this.activeClip.title);
  }

  public submit(){
    if(!this.activeClip)
      return;

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.';
    this.inSubmission = true;

    try{
      this.clipService.updateClip(this.clipID.value, this.title.value);
    }
    catch(e){
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later.';
      return;
    }

    // this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!.';

  }
}
