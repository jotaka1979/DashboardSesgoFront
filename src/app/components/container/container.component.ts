import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'das-container',
  imports: [],
  templateUrl: `container.component.html`,
  styleUrl: './container.component.css',
  standalone: true,
})
export class ContainerComponent { 
   @Input() loading = false;
}
