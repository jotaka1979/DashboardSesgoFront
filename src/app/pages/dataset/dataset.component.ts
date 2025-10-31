import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { FormsModule } from '@angular/forms';
import { DatasetStore } from './dataset.store';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dataset',
  imports: [CommonModule, ContainerComponent, FormsModule, CommonModule, MatSnackBarModule],
  templateUrl: 'dataset.component.html',
  styleUrl: './dataset.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetComponent {
  selectedFile?: File;
  description = signal('');
  Object = Object;
  constructor(public datasetStore: DatasetStore, private snackBar: MatSnackBar) { 
    this.datasetStore.reset();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (!this.selectedFile) return;
    this.datasetStore.uploadFile(this.selectedFile, this.description(), this.datasetStore.dataset_id());
  }

  onProcess(): void {
    this.snackBar.open('Acción de procesamiento iniciada ✅', 'Cerrar', {
      duration: 100000,              // duración en milisegundos
      horizontalPosition: 'right', // puede ser 'left', 'center', 'right'
      verticalPosition: 'top',     // puede ser 'top' o 'bottom'
    });
  }

  onDelete(): void {
    console.log("liminar", this.datasetStore.dataset_id())
    if (this.datasetStore.dataset_id() != 0) {
      this.datasetStore.deleteDataset(this.datasetStore.dataset_id());
      this.description.set("");
      this.selectedFile = undefined;
    }
  }

  formCompleted(): boolean {
    return (!!this.selectedFile && this.description() != '');
  }
}
