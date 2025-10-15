import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class Alert {
  @Input() color: 'blue' | 'green' | 'red' = 'blue';

  get bgColor(){
    const colorClasses = {
      blue: 'bg-blue-400',
      red: 'bg-red-400',
      green: 'bg-green-400'
    };
    return colorClasses[this.color] || 'bg-blue-400';
  }
}
