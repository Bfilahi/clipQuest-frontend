import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-submit-button',
  imports: [CommonModule],
  templateUrl: './submit-button.html',
  styleUrl: './submit-button.css'
})
export class SubmitButton {
  @Input() text: string = '';
  @Input() form!: FormGroup | NgForm;
  @Input() width: string = '';
  @Input() isDisabled: boolean = false;
}
