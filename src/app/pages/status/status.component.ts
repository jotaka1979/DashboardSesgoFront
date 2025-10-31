import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { NgIconComponent } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { StatusStore } from './status.store';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DatasetListModalComponent } from '../../components/dataset-list-modal/dataset-list-modal';


@Component({
  selector: 'app-status',
  imports: [ContainerComponent, NgIconComponent, RouterLink, DatePipe, MatButtonModule, MatDialogModule],
  templateUrl: `status.component.html`,
  styleUrl: './status.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent implements OnInit {
  constructor(public store: StatusStore, private dialog: MatDialog) { }

  ngOnInit() {
    this.store.loadDatasets();
    this.store.loadAllDatasets();
  }
  openDatasetModal() {
  const dialogRef = this.dialog.open(DatasetListModalComponent, {
    width: '1200px',
    maxHeight: '80vh', 
    data: this.store.allDatasets(),
    panelClass: 'custom-dialog-container'
  });

  dialogRef.afterClosed().subscribe((selectedDataset) => {
    if (selectedDataset) {
      console.log('Dataset seleccionado:', selectedDataset);
    }
  });
}
}
