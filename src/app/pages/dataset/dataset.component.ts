import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { FormsModule } from '@angular/forms';
import { DatasetStore } from './dataset.store';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProcessService } from '../../services/process.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dataset',
  imports: [CommonModule, ContainerComponent, FormsModule, MatSnackBarModule],
  templateUrl: 'dataset.component.html',
  styleUrl: './dataset.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetComponent {
  selectedFile?: File;
  description = signal('');
  Object = Object;
  constructor(public datasetStore: DatasetStore, private snackBar: MatSnackBar, private processService: ProcessService,  private router: Router) { 
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
    this.processService.processDataset(this.datasetStore.dataset_id()).subscribe();
    
      const snack = this.snackBar.open('Acción de procesamiento iniciada correctamente', 'Ir al inicio', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      let actionClicked = false;

      snack.onAction().subscribe(() => {
        actionClicked = true;
        this.router.navigate(['/status']);
      });

      snack.afterDismissed().subscribe(() => {
        if (!actionClicked) {
          this.router.navigate(['/status']);
        }
      });
    }

  onDelete(): void {
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
