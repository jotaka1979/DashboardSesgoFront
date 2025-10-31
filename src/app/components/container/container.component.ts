import { Component, Input } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'das-container',
  imports: [NgIconComponent, RouterLink],
  templateUrl: `container.component.html`,
  styleUrl: './container.component.css',
  standalone: true,
})
export class ContainerComponent { 
   @Input() loading = false;
}
