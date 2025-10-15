import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventBlocker]',
  standalone: true
})
export class EventBlocker {

  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvent(event: Event){
    event.preventDefault();
  }

}
