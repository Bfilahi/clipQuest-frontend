import { Component } from '@angular/core';
import { EventBlocker } from '../../../directives/event-blocker';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../shared/input-component/input-component";
import { Alert } from "../../shared/alert/alert";
import { SubmitButton } from "../../shared/submit-button/submit-button";
import { ClipService } from '../../../services/clipService';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, EventBlocker, ReactiveFormsModule, InputComponent, Alert, SubmitButton],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {

  public isDragOver: boolean = false;
  public file: File | null = null;
  public nextStep: boolean = false;
  public showAlert: boolean = false;
  public alertColor: any = 'blue';
  public alertMsg: string = 'Please wait! Your clip is being uploaded';

  public uploadForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)])
  });


  constructor(
    private clipService: ClipService,
    private router: Router
  ){}



  public storeFile(event: Event){    
    this.isDragOver = false;

    this.file = (event as DragEvent).dataTransfer ? 
                (event as DragEvent).dataTransfer?.files.item(0) ?? null : 
                (event.target as HTMLInputElement).files?.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4'){
      this.showAlert = true;
      this.alertMsg = 'Upload MP4 files only';
      this.alertColor = 'red';
      return;
    }

    this.showAlert = false;

    const titleWithoutExtension = this.file.name.replace(/\.[^/.]+$/, '') ?? '';
    this.uploadForm.controls.title.setValue(titleWithoutExtension);

    this.nextStep = true;
  }

  public uploadFile(form: FormGroup){
    form.disable();
    
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded';

    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('description', form.value.description);

    if(this.file)
      formData.append('file', this.file);

    this.clipService.uploadClip(formData).subscribe({
      next: () => {
        this.alertColor = 'green';
        this.alertMsg = 'Success!.';
        form.reset();

        setTimeout(() => this.router.navigate(['/']), 2000);
        form.enable();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.alertColor = 'red';
        this.alertMsg = 'Something went wrong. Try again later.';
        form.enable();
      }
    });
  }
}
