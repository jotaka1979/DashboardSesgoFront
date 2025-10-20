import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HttpClientModule, HttpEventType } from '@angular/common/http';
import { UploadService } from './dataset.service';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dataset',
  imports: [CommonModule, ContainerComponent, FormsModule, HttpClientModule],
  templateUrl: 'dataset.component.html',
  styleUrl: './dataset.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetComponent {
  selectedFile?: File;
  uploadProgress: number = 0;
  uploadComplete: boolean = false;
  description = signal(''); // 👈 signal de tipo string
  constructor(private uploadService: UploadService) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.uploadProgress = 0;
    this.uploadComplete = false;
  }

  onUpload(): void {   console.log(this.description())
    if (!this.selectedFile) return;
 

    this.uploadService.uploadFile(this.selectedFile, this.description()).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadComplete = true;
          console.log('✅ Respuesta del servidor:', event.body);
        }
      },
      error: (err) => {
        console.error('❌ Error al subir archivo:', err);
      }
    });
  }
}
