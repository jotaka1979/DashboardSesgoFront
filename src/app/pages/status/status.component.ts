import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { NgIconComponent } from '@ng-icons/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-status',
  imports: [ContainerComponent, NgIconComponent, RouterLink],
  templateUrl: `status.component.html`,
  styleUrl: './status.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent { }
