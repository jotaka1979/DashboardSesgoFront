import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { NgIconComponent } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { StatusStore } from './status.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-status',
  imports: [ContainerComponent, NgIconComponent, RouterLink, DatePipe ],
  templateUrl: `status.component.html`,
  styleUrl: './status.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent implements OnInit {
  constructor(public store: StatusStore) {}

    ngOnInit() {
    this.store.loadDatasets();
  }
}
