import { Component, OnDestroy } from '@angular/core';
import { EventBlocker } from '../../../directives/event-blocker';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../shared/input-component/input-component";
import { v4 as uuid } from 'uuid';
import { Alert } from "../../shared/alert/alert";

@Component({
  selector: 'app-upload',
  imports: [CommonModule, EventBlocker, ReactiveFormsModule, InputComponent, Alert],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload implements OnDestroy{

  public isDragOver: boolean = false;
  public file: File | null = null;
  public nextStep: boolean = false;
  public showAlert: boolean = false;
  public alertColor: any = 'blue';
  public alertMsg: string = 'Please wait! Your clip is being uploaded';
  public inSubmission: boolean = false;

  public ngOnDestroy(): void {
    
  }

  public title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });


  public uploadForm = new FormGroup({
    title: this.title
  });

  public storeFile(event: Event){
    this.isDragOver = false;

    this.file = (event as DragEvent).dataTransfer ? 
                (event as DragEvent).dataTransfer?.files.item(0) ?? null : 
                (event.target as HTMLInputElement).files?.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4')
      return;

    this.nextStep = true;

    const titleWithoutExtension = this.file.name.replace(/\.[^/.]+$/, '');
    this.title.setValue(titleWithoutExtension);
  }

  public uploadFile(){
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded';
    this.inSubmission = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    // now, using the service upload to the database.  this.storage.upload(clipPath, this.file);
    // in the backend check if the user is logged-in and check the size (size < 10 * 1000 * 1000) and type (video/mp4)
  }
}
