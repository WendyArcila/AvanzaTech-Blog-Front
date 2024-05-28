import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn.component.html',
})
export class BtnComponent {
  @Input() typeBtn!: string;
  @Input() color!: string;

  constructor() {

  }

  ngOnInit(){
  }

  get colors() {
    return {
      'text-green-700': this.color === 'green',
      'focus:border-green-800': this.color === 'green',
      'hover:bg-green-200': this.color === 'green',
      'text-red-700': this.color === 'red',
      'focus:ring-red-300': this.color === 'red',
      'hover:bg-red-300': this.color === 'red',
      'font-medium rounded text-base px-5 py-2 bg-gray-50 focus:right-4 border-gray-900 border-2 my-5': true
    }
    };
  }




