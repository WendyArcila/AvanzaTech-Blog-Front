import { Component, ElementRef, ViewChild } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-richtext',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './richtext.component.html',
  styleUrl: './richtext.component.css'
})
export class RichtextComponent {

  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;

  activeButtonStyle = '';

  format(command: string, value?: string) {
    document.execCommand(command, false, value);

    switch (command) {
      case 'bold':
        this.activeButtonStyle = 'font-bold';
        break;
      case 'italic':
        this.activeButtonStyle = 'italic';
        break;
      case 'underline':
        this.activeButtonStyle = 'underline';
        break;
      default:
        this.activeButtonStyle = '';
    }
  }

}
