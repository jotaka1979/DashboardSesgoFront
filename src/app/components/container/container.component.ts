import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'das-container',
  imports: [],
  templateUrl: `container.component.html`,
  styleUrl: './container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent { }
