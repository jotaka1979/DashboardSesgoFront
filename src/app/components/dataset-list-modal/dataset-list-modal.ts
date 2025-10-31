import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Dataset } from '../../models/dataset';

@Component({
  selector: 'app-dataset-list-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule, DatePipe],
  templateUrl: './dataset-list-modal.html',
})
export class DatasetListModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public datasets: Dataset[],
    private dialogRef: MatDialogRef<DatasetListModalComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  selectDataset(dataset: Dataset): void {
    this.dialogRef.close(dataset);
  }
}
