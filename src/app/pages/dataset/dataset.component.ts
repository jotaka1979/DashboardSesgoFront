import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { FormsModule } from '@angular/forms';
import { DatasetStore } from './dataset.store';
@Component({
  selector: 'app-dataset',
  imports: [CommonModule, ContainerComponent, FormsModule, CommonModule],
  templateUrl: 'dataset.component.html',
  styleUrl: './dataset.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetComponent {
  selectedFile?: File;
  description = signal(''); 
  Object = Object;
  constructor(public datasetStore: DatasetStore) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {   console.log(this.description())
    if (!this.selectedFile) return;
    this.datasetStore.uploadFile(this.selectedFile, this.description());
  }
}
